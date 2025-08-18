import { Pipe, PipeTransform } from '@angular/core';
import { CourseSchedule } from '../interfaces';

@Pipe({
  name: 'schedule'
})
export class SchedulePipe implements PipeTransform {

  private readonly days = {
    "monday": "Lunes",
    "tuesday": "Martes",
    "wednesday": "Miércoles",
    "thursday": "Jueves",
    "friday": "Viernes",
    "saturday": "Sábado",
    "sunday": "Domingo",
  }

  private readonly shift = {
    "morning": "Mañana",
    "afternoon": "Tarde",
    "evening": "Noche",
  }

  transform(value: CourseSchedule): string {
    return `${this.days[value.dayOfWeek]} | ${value.startTime} - ${value.endTime} | ${this.shift[value.shift]}`;
  }

}
