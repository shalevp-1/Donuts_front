import type { Donut } from "../Models/Donuts";
import { buildApiUrl } from "./apiClient";

function normalizeIngredients(rawIngredients: unknown): string[] {
    if (Array.isArray(rawIngredients)) {
        return rawIngredients.map((ingredient) => String(ingredient).trim()).filter(Boolean);
    }

    if (typeof rawIngredients === "string") {
        const trimmed = rawIngredients.trim();

        if (!trimmed) {
            return [];
        }

        try {
            const parsed = JSON.parse(trimmed);
            if (Array.isArray(parsed)) {
                return parsed.map((ingredient) => String(ingredient).trim()).filter(Boolean);
            }
        } catch {
            // Fall back to comma-separated text.
        }

        return trimmed.split(",").map((ingredient) => ingredient.trim()).filter(Boolean);
    }

    return [];
}

export function normalizeDonut(rawDonut: unknown): Donut {
    const donut = rawDonut && typeof rawDonut === "object"
        ? rawDonut as Record<string, unknown>
        : {};

    return {
        id: Number(donut.id),
        name: String(donut.name ?? ""),
        description: String(donut.description ?? ""),
        price: Number(donut.price ?? 0),
        ingredients: normalizeIngredients(donut.ingredients),
        calories: Number(donut.calories ?? 0),
        image: String(donut.image ?? "")
    };
}

export async function fetchDonuts(): Promise<Donut[]> {
    const response = await fetch(buildApiUrl("/donuts"));

    if (!response.ok) {
        throw new Error(`Failed to load donuts: ${response.status}`);
    }

    const donuts: unknown = await response.json();
    if (!Array.isArray(donuts)) {
        throw new Error("The server returned an invalid donut list.");
    }

    return donuts.map(normalizeDonut);
}
