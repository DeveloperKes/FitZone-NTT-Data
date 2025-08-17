export type ScheduleShift = 'morning' | 'afternoon' | 'evening';
export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'

export interface CourseSchedule {
    id?: number;
    courseId: number;
    dayOfWeek: DayOfWeek;
    shift: ScheduleShift;
    startTime: string;
    endTime: string;
}