import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'level'
})
export class LevelPipe implements PipeTransform {

  transform(value: string,): string {
    if (value == "beginner") return "Principiante";
    if (value == "intermediate") return "Intermedio";
    if (value == "advanced") return "Avanzado";
    return "";
  }

}
