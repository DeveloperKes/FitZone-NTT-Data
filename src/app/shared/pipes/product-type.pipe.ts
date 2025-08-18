import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'productType'
})
export class ProductTypePipe implements PipeTransform {

  transform(value: string,): string {
    if (value == "class") return "Clase";
    if (value == "plan") return "Paquete";
    return "";
  }

}
