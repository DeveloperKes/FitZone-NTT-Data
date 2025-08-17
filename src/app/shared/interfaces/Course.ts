import { Headquarters } from "./Headquarters";
import { CourseSchedule } from "./Schedule";

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export type DayOfWeek =
    | 'monday'
    | 'tuesday'
    | 'wednesday'
    | 'thursday'
    | 'friday'
    | 'saturday'
    | 'sunday';

export type TimeSlot = 'morning' | 'afternoon' | 'evening';

export interface Course {
    id: string;
    title: string;
    description: string;
    duration: number;
    level: CourseLevel;
    instructor: string;
    thumbnailUrl: string;
    category: string;
    headquarters: Headquarters;
    price: number;
    schedule: CourseSchedule[];
}

export interface CoursePayload extends Omit<Course, 'id' | 'headquarters' | 'category' | 'schedule'> {
    headquartersId: number;
    categoryId: number;
}