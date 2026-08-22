import { useCoursesQuery } from "@/api/courses-api";
import { DataTable } from "@/components/data-table";
import Loading from "@/components/loading/loading";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { coursesColumns } from "./columns";

const CoursesPage = () => {
  const { data: courses, isLoading } = useCoursesQuery();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Loading />;
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-4 p-4 text-foreground">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Courses</h1>
          <p className="text-sm text-muted-foreground">Create and manage your course catalog</p>
        </div>
        <Link to={"/dashboard/courses/add"}>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </Link>
      </div>
      <div className="w-full overflow-y-auto">
        <DataTable columns={coursesColumns} data={courses?.data!.items!} />
      </div>
    </div>
  );
};

export default CoursesPage;
