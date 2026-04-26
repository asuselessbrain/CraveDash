import Image from "next/image";
import Link from "next/link";

type Cuisine = {
	id: string;
	slug?: string;
	name: string;
	image: string;
	dishes?: string;
	samples: string[];
};

function toSlug(value: string) {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-");
}

function getDishesCount(value?: string) {
	if (!value) return 0;
	const match = value.match(/\d+/);
	if (!match) return 0;
	return Number(match[0]) || 0;
}

export default function CuisineExplorer({ items }: { items?: Cuisine[] }) {
	const cuisines = (items?.length ? items : [])
		.slice()
		.sort((a, b) => getDishesCount(b.dishes) - getDishesCount(a.dishes));
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
				<div className="mb-6">
					<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
						Explore Cuisines from Around the World
					</h2>
				</div>

				{cuisines.length === 0 ? (
					<div className="rounded-2xl border border-dashed border-slate-300 bg-white/80 p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-950/60 dark:text-slate-300">
						No cuisines available in the database yet.
					</div>
				) : (
					<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
					{cuisines.map((cuisine) => (
						<Link
							key={cuisine.id}
							href={`/meals?cuisine=${cuisine.id || toSlug(cuisine.name)}`}
							className="group relative aspect-4/5 overflow-hidden rounded-3xl border border-white/60 shadow-md shadow-black/10 sm:aspect-3/4"
						>
							<Image
								src={cuisine.image}
								alt={`${cuisine.name} cuisine`}
								fill
								sizes="(min-width: 1280px) 24vw, (min-width: 640px) 48vw, 100vw"
								className="object-cover transition duration-500 group-hover:scale-110"
							/>

							<div className="absolute inset-0 bg-linear-to-t from-black/78 via-black/38 to-black/10" />

							<div className="absolute inset-x-0 bottom-0 p-4 text-white">
								<h3 className="text-xl font-bold tracking-tight">{cuisine.name}</h3>
								<p className="mt-1 text-sm text-white/85">{cuisine.dishes || "Explore dishes"}</p>

								<div className="mt-3 max-h-0 overflow-hidden rounded-xl bg-white/15 p-0 text-sm backdrop-blur-sm transition-all duration-300 group-hover:max-h-24 group-hover:p-3">
									<p className="font-semibold">Popular:</p>
									<p className="mt-1 text-white/90">{cuisine.samples.join(" • ")}</p>
								</div>
							</div>
						</Link>
					))}
					</div>
				)}
			</div>
		</section>
	);
}
