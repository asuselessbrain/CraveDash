import Image from "next/image";
import Link from "next/link";

type Cuisine = {
	id: number;
	slug: string;
	name: string;
	image: string;
	dishes: string;
	samples: string[];
};

const cuisines: Cuisine[] = [
	{
		id: 1,
		slug: "italian",
		name: "Italian",
		image: "/cuisines/italian.svg",
		dishes: "120+ dishes",
		samples: ["Margherita Pizza", "Creamy Alfredo Pasta"],
	},
	{
		id: 2,
		slug: "chinese",
		name: "Chinese",
		image: "/cuisines/chinese.svg",
		dishes: "95+ dishes",
		samples: ["Szechuan Noodles", "Kung Pao Chicken"],
	},
	{
		id: 3,
		slug: "indian",
		name: "Indian",
		image: "/cuisines/indian.svg",
		dishes: "140+ dishes",
		samples: ["Butter Chicken", "Kacchi Biryani"],
	},
	{
		id: 4,
		slug: "japanese",
		name: "Japanese",
		image: "/cuisines/japanese.svg",
		dishes: "70+ dishes",
		samples: ["Salmon Sushi", "Chicken Ramen"],
	},
	{
		id: 5,
		slug: "mexican",
		name: "Mexican",
		image: "/cuisines/mexican.svg",
		dishes: "80+ dishes",
		samples: ["Loaded Tacos", "Burrito Bowl"],
	},
	{
		id: 6,
		slug: "thai",
		name: "Thai",
		image: "/cuisines/thai.svg",
		dishes: "65+ dishes",
		samples: ["Pad Thai", "Tom Yum Soup"],
	},
	{
		id: 7,
		slug: "korean",
		name: "Korean",
		image: "/cuisines/korean.svg",
		dishes: "58+ dishes",
		samples: ["Kimchi Fried Rice", "Bulgogi Beef"],
	},
	{
		id: 8,
		slug: "mediterranean",
		name: "Mediterranean",
		image: "/cuisines/mediterranean.svg",
		dishes: "76+ dishes",
		samples: ["Chicken Shawarma", "Falafel Plate"],
	},
];

export default function CuisineExplorer() {
	return (
		<section className="mx-auto mt-16 max-w-7xl px-4 sm:px-6 lg:px-8">
			<div className="overflow-hidden rounded-[2.25rem] border border-orange-200/70 bg-linear-to-br from-orange-50 via-amber-50 to-rose-50 p-6 shadow-lg shadow-orange-500/10 sm:p-8 lg:p-10 dark:border-orange-400/20 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
				<div className="mb-6">
					<h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
						Explore Cuisines from Around the World
					</h2>
				</div>

				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
				{cuisines.map((cuisine) => (
					<Link
						key={cuisine.id}
						href={`/browse?cuisine=${cuisine.slug}`}
						className="group relative h-78 overflow-hidden rounded-3xl border border-white/60 shadow-md shadow-black/10"
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
							<p className="mt-1 text-sm text-white/85">{cuisine.dishes}</p>

							<div className="mt-3 max-h-0 overflow-hidden rounded-xl bg-white/15 p-0 text-sm backdrop-blur-sm transition-all duration-300 group-hover:max-h-24 group-hover:p-3">
								<p className="font-semibold">Popular:</p>
								<p className="mt-1 text-white/90">{cuisine.samples.join(" • ")}</p>
							</div>
						</div>
					</Link>
				))}
				</div>
			</div>
		</section>
	);
}
