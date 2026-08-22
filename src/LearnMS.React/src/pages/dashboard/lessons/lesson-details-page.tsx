import
  {
    UpdateLessonRequest,
    useDeleteLessonMutation,
    useUpdateLessonMutation
  } from "@/api/lessons-api";
import { api, ApiResponse } from "@/api";
import Confirmation from "@/components/confirmation";
import { LessonVideoPlayer } from "@/components/lesson-video-player";
import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import
  {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { getGetLessonQueryKey, useGetLesson, useGetProfile } from "@/generated/api";
import { GetDashboardLessonResult } from "@/generated/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import Tus from "@uppy/tus";
import { ListCollapse, Settings2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "@/components/theme-provider";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

const LessonDetailsPage = () => {
  const { courseId, lectureId, lessonId } = useParams();
  const navigate = useNavigate();

  
  const {data: lesson, isLoading, isError} = useGetLesson(courseId!, lectureId!, lessonId!);

  const deleteLessonMutation = useDeleteLessonMutation();

  if (isLoading) {
    return (
      <div className='flex items-center justify-center w-full h-full'>
        <Loading />
      </div>
    );
  }

  const onDeleting = () => {
    deleteLessonMutation.mutate(
      {
        lectureId: lectureId!,
        courseId: courseId!,
        lessonId: lessonId!,
      },
      {
        onSuccess() {
          navigate(`/dashboard/courses/${courseId}/lectures/${lectureId}`, {
            replace: true,
          });
          toast({
            title: "Deleting",
            description: "Successfully deleted the lesson",
          });
        },
      }
    );
  };

  if (isError || lesson?.data?.$type === "GetStudentLessonResult") {
    return;
  }

  return (
    <div className='w-full h-full p-4 text-foreground'>
      <div className='flex justify-between w-full'>
        <h1 className='text-3xl font-semibold tracking-tight'>Lesson Setup</h1>
        <div className='flex gap-2 item-center'>
          <Confirmation
            button={<Button variant='destructive'>Delete</Button>}
            title='Are you sure you want to delete this lesson?'
            description='This action cannot be undone.'
            onConfirm={onDeleting}
          />
        </div>
      </div>

      <div className='grid w-full grid-cols-2 mt-10'>
        <LessonDetailsContent
          {...lesson?.data!}
          courseId={courseId!}
          lectureId={lectureId!}
        />
        <LessonVideo
          lesson={lesson?.data!}
          lessonId={lessonId!}
          lectureId={lectureId!}
          courseId={courseId!}
        />
      </div>
    </div>
  );
};

function LessonDetailsContent({
  id,
  description,
  title,
  expirationHours,
  renewalPrice,
  courseId,
  lectureId,
}: GetDashboardLessonResult & { lectureId: string; courseId: string }) {
  const updateLessonMutation = useUpdateLessonMutation();

  const form = useForm<UpdateLessonRequest>({
    resolver: zodResolver(UpdateLessonRequest),
    defaultValues: {
      description,
      title,
      expirationHours,
      renewalPrice,
    },
    values: { description, title, expirationHours, renewalPrice },
  });

  const onSubmit = (data: UpdateLessonRequest) => {
    updateLessonMutation.mutate(
      { lectureId, lessonId: id, courseId, data },
      {
        onSuccess: (data) => {
          toast({
            title: "Lesson updated",
            description: data.message,
          });
        },
      }
    );
  };

  return (
    <div className='px-2'>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-2 p-2'>
          <fieldset
            className='flex items-center gap-2 p-2 text-xl'
            disabled={updateLessonMutation.isPending}>
            <Settings2 className='dashboard-icon' />
            Lesson Details
            {form.formState.isDirty && (
              <div className='space-x-1 ms-auto'>
                <Button>Save</Button>
                <Button
                  variant='outline'
                  type='button'
                  onClick={() => form.reset()}>
                  Reset
                </Button>
              </div>
            )}
          </fieldset>
          <FormField
            control={form.control}
            name='title'
            render={({ field }) => (
              <FormItem className='dashboard-field'>
                <FormLabel className='dashboard-field-label'>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='dashboard-field'>
                <FormLabel className='dashboard-field-label'>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='renewalPrice'
            render={({ field }) => (
              <FormItem className='dashboard-field'>
                <FormLabel className='dashboard-field-label'>Renewal Price</FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='expirationHours'
            render={({ field }) => (
              <FormItem className='dashboard-field'>
                <FormLabel className='dashboard-field-label'>
                  Expiration Hours
                </FormLabel>
                <FormControl>
                  <Input type='number' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}

function LessonVideo({
  lessonId,
  courseId,
  lectureId,
  lesson,
}: {
  lessonId: string;
  lectureId: string;
  courseId: string;
  lesson:  GetDashboardLessonResult;
}) {
  const qc = useQueryClient();
  const { data: profile } = useGetProfile();
  const { theme } = useTheme();
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const { data: youtubeStatus } = useQuery({
    queryKey: ["youtube-status"],
    queryFn: () =>
      api.get<ApiResponse<{ connected: boolean }>>("/api/youtube/status").then((res) => res.data),
  });

  useEffect(() => {
    const isDark =
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches);

    const instance = new Uppy({
      autoProceed: true,
      restrictions: {
        allowedFileTypes: ["video/*"],
        minNumberOfFiles: 1,
        maxNumberOfFiles: 1,
      },
    }).use(Tus, {
      endpoint: `/api/courses/${courseId}/lectures/${lectureId}/lessons/${lessonId}/video`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      onShouldRetry() {
        return false;
      },
    }).use(Dashboard, {
      inline: true,
      target: "#lesson-video-uploader",
      height: 260,
      theme: isDark ? "dark" : "light",
      proudlyDisplayPoweredByUppy: false,
      showProgressDetails: true,
      hideCancelButton: false,
      note: "Drop a lesson video here. Keep this page open until upload finishes.",
    });

    const onProgress = (
      _file: unknown,
      fileProgress: { bytesUploaded: number; bytesTotal: number | null }
    ) => {
      if (!fileProgress.bytesTotal) return;
      setProgress(
        Math.round((fileProgress.bytesUploaded / fileProgress.bytesTotal) * 100)
      );
    };
    const onUpload = () => {
      setUploading(true);
      setProgress(0);
    };
    const onComplete = (result: { failed: unknown[] }) => {
      setUploading(false);
      if (result.failed.length) return;
      setProgress(100);
      toast({
        title: "Video uploaded successfully",
        description:
          "Playback may take a few minutes while the video finishes processing.",
      });
      qc.invalidateQueries({
        queryKey: getGetLessonQueryKey(courseId, lectureId, lessonId),
      });
      qc.invalidateQueries({
        queryKey: ["lesson", { id: lessonId }],
      });
    };
    const onError = () => {
      setUploading(false);
      toast({
        title: "Video upload failed",
        description: "Check that video hosting is connected, then try again.",
        variant: "destructive",
      });
    };

    instance.on("upload", onUpload);
    instance.on("upload-progress", onProgress);
    instance.on("complete", onComplete);
    instance.on("error", onError);
    instance.on("upload-error", onError);

    return () => {
      instance.close();
    };
  }, [courseId, lectureId, lessonId, qc, theme]);

  const connectYouTube = async () => {
    const res = await api.get<ApiResponse<string>>("/api/youtube/connect");
    if (res.data.data) {
      window.location.href = res.data.data;
    }
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between text-xl'>
        <div className='flex items-center gap-2'>
          <ListCollapse className='dashboard-icon' />
          Lesson Content
        </div>
        {profile?.data?.role === "Teacher" && (
          <Button
            type='button'
            variant={youtubeStatus?.data?.connected ? "outline" : "default"}
            onClick={connectYouTube}>
            {youtubeStatus?.data?.connected ? "Reconnect hosting" : "Connect video hosting"}
          </Button>
        )}
      </div>

      {youtubeStatus?.data && youtubeStatus.data.connected === false && (
        <p className='text-sm text-amber-700 dark:text-amber-300'>
          Connect video hosting once, then you can upload lesson videos from this page.
        </p>
      )}

      <div id='lesson-video-uploader' />

      {uploading && (
        <div className='space-y-2'>
          <div className='flex justify-between text-sm text-muted-foreground'>
            <span>Uploading video</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} />
        </div>
      )}

      {lesson.videoOTP?.otp && (
        <div className='w-full rounded-xl aspect-video overflow-clip bg-black'>
          <LessonVideoPlayer otp={lesson.videoOTP.otp} />
        </div>
      )}
    </div>
  );
}

export default LessonDetailsPage;
