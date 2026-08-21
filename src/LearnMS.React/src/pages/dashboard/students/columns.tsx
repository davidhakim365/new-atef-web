import { useDeleteStudentMutation } from "@/api/students-api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getGetAllStudentsQueryKey,
  useUnlinkStudentDevice,
} from "@/generated/api";
import {
  SingleStudent,
  SingleStudentEvent,
  SingleStudentExam,
  SingleStudentLecture,
} from "@/generated/model";
import { useModalStore } from "@/store/use-modal-store";
import { useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import {
  CheckCircle,
  Circle,
  CreditCard,
  MoreHorizontal,
  MoreVertical,
  Network,
  Trash,
} from "lucide-react";
import { FaChrome } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getFirstCharacters } from "../../../lib/utils";
import Confirmation from "@/components/confirmation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import {
  getGetLectureStudentsQueryKey,
  useChangeLectureHomeworkScore,
  useChangeLectureQuizScore,
  useEnrollStudentInLecture,
  useToggleLectureAttendance,
} from "@/generated/api";
import { SingleLectureStudent } from "@/generated/model";
import { toast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useSearchParams } from "react-router-dom";
const levelMap = {
  Level0: "3rd Prep School",
  Level1: "1st Secondary ",
  Level2: "2nd Secondary ",
  Level3: "3rd Secondary ",
};

export const studentsColumns: ColumnDef<SingleStudent>[] = [
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    size: 1,
    cell: ({ row }) => {
      const student = row.original;
      const { openModal } = useModalStore();
      const qc = useQueryClient();
      const deleteStudentMutation = useDeleteStudentMutation();
      const unlinkDeviceMutation = useUnlinkStudentDevice({
        mutation: {
          onSuccess: () => {
            qc.invalidateQueries({ queryKey: getGetAllStudentsQueryKey() });
          },
        },
      });
      const onDeleting = () => {
        deleteStudentMutation.mutate({ id: student.id });
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="text-center shadow-md shadow-primary"
          >
            <DropdownMenuLabel>Actions</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => openModal("add-credit-modal", { student })}
              className="flex items-center gap-2 hover:cursor-pointer hover:bg-primary hover:text-white"
            >
              <CreditCard />
              Add Credit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link to={`/dashboard/students/${student.id}`}>
              <DropdownMenuItem className="flex items-center gap-2 hover:cursor-pointer hover:bg-primary hover:text-white">
                <MoreVertical /> View
              </DropdownMenuItem>
            </Link>
            {/*
            <DropdownMenuItem className='flex items-center gap-2 hover:cursor-pointer hover:bg-primary hover:text-white'>
              <MailCheck /> Verify Email
            </DropdownMenuItem>
            */}

            <DropdownMenuSeparator />
            <div className="grid items-center w-full grid-cols-2 gap-2 hover:cursor-pointer hover:text-red-500">
              <Confirmation
                button={
                  <Button
                    className="flex w-full gap-2 text-red-500 border-none hover:bg-red-500 hover:text-white"
                    variant="outline"
                  >
                    <Network className="w-4 h-4" />
                    Unlink Device
                  </Button>
                }
                title="Are you sure you want to unlink this device?"
                description="This action cannot be undone."
                onConfirm={() =>
                  unlinkDeviceMutation.mutate({ studentId: student.id })
                }
              />
              <Confirmation
                button={
                  <Button
                    className="flex w-full gap-2 text-red-500 border-none hover:bg-red-500 hover:text-white"
                    variant="outline"
                  >
                    <Trash className="w-4 h-4" />
                    Delete
                  </Button>
                }
                title="Are you sure you want to delete this student?"
                description="This action cannot be undone."
                onConfirm={onDeleting}
              />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "studentCode",
    header: "ID",
    size: 50,
  },
  {
    accessorKey: "credit",
    header: "Credit",
    size: 50,
  },
  {
    accessorKey: "email",
    header: "Email",
  },

  {
    accessorKey: "fullName",
    header: "Full Name",
  },

  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const student = row.original;

      return levelMap[student.level];
    },
  },
  {
    accessorKey: "deviceLinked",
    header: "Device Linked",
    size: 6,
    cell: ({ row }) => {
      const student = row.original;
      return (
        <div className="flex items-center justify-center">
          {student.deviceLinked ? (
            <FaChrome className="w-6 h-6 text-primary" />
          ) : (
            <FaChrome className="w-6 h-6 text-zinc-400" />
          )}
        </div>
      );
    },
  },
];

export const studentLecturesColumns: ColumnDef<SingleStudentLecture>[] = [
  {
    accessorKey: "title",
    header: "Lecture",
    cell({ row }) {
      const lecture = row.original;
      return (
        <div>
          <Link
            className="underline hover:cursor-pointer hover:text-blue-500"
            to={`/dashboard/courses/${lecture.courseId}/lectures/${lecture.id}`}
          >
            {lecture.title}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "courseTitle",
    header: "Course",
  },

  {
    header: "Center Attendance",
    cell: ({ row }) => {
      const attended = row.original.attended;
      return (
        <div className="flex items-center justify-center">
          {attended ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <Circle className="w-6 h-6" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "enrollmentStatus",
    header: "Online Enrollment",
    cell({ row }) {
      const status = row.original.enrollmentStatus;
      // Map string value to enum if necessary
      return status ? status : "Not Enrolled"; // Assuming status is already in enum format
    },
  },
  {
    accessorKey: "homeworkScore",
    header: "Homework",
    cell({ row }) {
      const score = row.original.homeworkScore;
      return score === 1 || score == null ? "-" : score;
    },
  },
  {
    accessorKey: "quizScore",
    header: "Quiz Score",
    cell({ row }) {
      const score = row.original.quizScore;
      return score != null ? score : "-";
    },
  },

  {
    accessorKey: "studentQuizzesScore",
    header: "Online Quizzes Score",
    cell({ row }) {
      const studentScore = row.original.studentQuizzesScore;
      const totalScore = row.original.totalQuizzesScore;
      return studentScore != null && totalScore != null
        ? `${studentScore} / ${totalScore}`
        : "-";
    },
  },
];

export const studentEventsColumns: ColumnDef<SingleStudentEvent>[] = [
  {
    accessorKey: "message",
    header: "Message",
    size: 300,
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    size: 10,
    cell({ row }) {
      const event = row.original;
      return <div>{new Date(event.createdAt).toLocaleString()}</div>;
    },
  },
];

export const studentExamsColumns: ColumnDef<SingleStudentExam>[] = [
  {
    accessorKey: "title",
    header: "Title",
    cell({ row }) {
      const exam = row.original;
      return (
        <div>
          <Link
            className="underline hover:cursor-pointer hover:text-blue-500"
            to={`/dashboard/courses/${exam.courseId}/exams/${exam.id}`}
          >
            {exam.title}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: "studentScore",
    header: "Score",
    cell({ row }) {
      const exam = row.original;

      if (!exam.studentScore || !exam.totalScore) return;

      return (
        <div>
          {exam.studentScore} / {exam.totalScore}
        </div>
      );
    },
  },
  {
    accessorKey: "submittedAt",
    header: "Submitted At",
    cell({ row }) {
      const exam = row.original;
      if (!exam.submittedAt) return;
      return <div>{new Date(exam.submittedAt).toLocaleDateString()}</div>;
    },
  },
];
