import { inject } from "@angular/core";
import { CourseService } from "../services";

export const coursesResolver = () => {
    const courseService = inject(CourseService);
    return courseService.getAllCourses();
};