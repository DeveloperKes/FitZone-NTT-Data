import { inject } from "@angular/core"
import { CategoriesService } from "../services"

export const categoriesResolver = () => {
    const categoryService = inject(CategoriesService);
    return categoryService.getAllCategories();
}