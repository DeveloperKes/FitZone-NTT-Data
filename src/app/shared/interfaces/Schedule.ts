export type ScheduleShift = 'morning' | 'afternoon' | 'evening';

export interface CourseSchedule {
    id?: number;
    courseId: number;
    dayOfWeek: string;
    shift: ScheduleShift;
    startTime: string;
    endTime: string;
}