import { Donut } from "../Models/Donuts";

const DONUTS_API_URL = "http://localhost:8800/donuts";

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

function normalizeDonut(rawDonut: any): Donut {
    return {
        id: Number(rawDonut.id),
        name: String(rawDonut.name ?? ""),
        description: String(rawDonut.description ?? ""),
        price: Number(rawDonut.price ?? 0),
        ingredients: normalizeIngredients(rawDonut.ingredients),
        calories: Number(rawDonut.calories ?? 0),
        image: String(rawDonut.image ?? "")
    };
}

export async function fetchDonuts(): Promise<Donut[]> {
    const response = await fetch(DONUTS_API_URL);

    if (!response.ok) {
        throw new Error(`Failed to load donuts: ${response.status}`);
    }

    const donuts = await response.json();
    return Array.isArray(donuts) ? donuts.map(normalizeDonut) : [];
}
