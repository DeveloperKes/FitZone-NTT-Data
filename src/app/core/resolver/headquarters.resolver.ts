import { inject } from "@angular/core";
import { HeadquartersService } from "../services";

export const headquartersResolver = () => {
    const headquartersService = inject(HeadquartersService);
    return headquartersService.getAllHeadquarters();
}