import { DataTable } from "@/components/data-table";
import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetAllStudents } from "@/generated/api";
import { StudentLevel } from "@/generated/model";
import useDownloadFile from "@/hooks/useDownloadFile";
import { studentsColumns } from "@/pages/dashboard/students/columns";
import { useModalStore } from "@/store/use-modal-store";
import { PaginationState } from "@tanstack/react-table";
import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { FaFileExport } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";

const StudentsPage = () => {
  const { openModal } = useModalStore();
  const { download, isDownloading } = useDownloadFile();
  const [searchParams, setSearchParams] = useSearchParams({});

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: parseInt(searchParams.get("page") || "1") - 1,
    pageSize: parseInt(searchParams.get("pageSize") || "10"),
  });
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [level, setLevel] = useState(searchParams.get("level") ?? "all");
  const { data: students, isLoading } = useGetAllStudents({
    page: pageIndex + 1,
    pageSize,
    search,
    level: level as StudentLevel,
  });

  const onExport = async () => {
    await download(`/api/students/export?level=${level}`, "students.csv");
  };

  useEffect(() => {
    setSearchParams({
      page: `${pageIndex + 1}`,
      pageSize: `${pageSize}`,
      ...(search ? { search } : {}),
      ...(level ? { level } : {}),
    });
  }, [pageIndex, pageSize, search, level]);

  return (
    <div className="flex flex-col w-full h-full gap-4 p-4 text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Students</h1>
          <p className="text-sm text-muted-foreground">
            Search, export, and manage student accounts
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => openModal("add-student-modal")}>
            <Plus className="mr-1 h-4 w-4" /> Add Student
          </Button>
          <Input
            className="w-56"
            placeholder="search for a student"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <Select onValueChange={setLevel}>
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select a level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={"all"}>All</SelectItem>
              <SelectItem value={StudentLevel.Level0}>3rd Prep</SelectItem>
              <SelectItem value={StudentLevel.Level1}>1st Secondary</SelectItem>
              <SelectItem value={StudentLevel.Level2}>2nd Secondary</SelectItem>
              <SelectItem value={StudentLevel.Level3}>3rd Secondary</SelectItem>
            </SelectContent>
          </Select>
          <Button
            disabled={isDownloading}
            variant="outline"
            size="icon"
            onClick={onExport}
          >
            {(!isDownloading && <FaFileExport />) || (
              <Loader2 className="w-4 h-4 animate-spin" />
            )}
          </Button>
        </div>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <DataTable
          pagination={{
            hasNextPage: students?.data!.hasNextPage!,
            hasPreviousPage: students?.data!.hasPreviousPage!,
            pageCount: students?.data!.totalCount!,
            pageIndex,
            pageSize,
          }}
          rowCount={students?.data!.totalCount!}
          setPagination={setPagination}
          data={students?.data!.items!}
          columns={studentsColumns}
        />
      )}
    </div>
  );
};

export default StudentsPage;
