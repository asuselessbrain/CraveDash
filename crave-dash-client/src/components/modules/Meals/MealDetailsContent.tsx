"use client";

import { useState } from "react";
import {
    Plus,
    Minus,
    Flame,
    Leaf,
    AlertCircle,
    Star,
    MapPin,
    ShoppingCart,
    CheckCircle2,
    ChevronRight,
    PlayCircle,
    Clock,
    UtensilsCrossed,
    Share2,
    Heart,
} from "lucide-react";
import Image from "next/image";
import { NormalizedMealDetails } from "@/types/meals";
import Link from "next/link";
import { addToCart } from "@/services/cart";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type MealDetailsContentProps = {
    meal: NormalizedMealDetails;
};

const mockReviews = [
    {
        id: "1",
        name: "Arfan Khan",
        avatar: "AK",
        rating: 5,
        date: "Apr 5, 2026",
        text: "Absolutely delicious! The bread was crispy and the tomatoes were fresh. Highly recommend!",
        verified: true,
        helpful: 42,
    },
    {
        id: "2",
        name: "Sara Ahmed",
        avatar: "SA",
        rating: 4,
        date: "Apr 3, 2026",
        text: "Great taste but could use more basil. Otherwise perfect!",
        verified: true,
        helpful: 18,
    },
    {
        id: "3",
        name: "Rahim Hassan",
        avatar: "RH",
        rating: 5,
        date: "Mar 30, 2026",
        text: "Best bruschetta I've had in this city. Will order again!",
        verified: false,
        helpful: 35,
    },
];

const spiceLevelEmoji: Record<string, string> = {
    MILD: "🌶️",
    MEDIUM: "🌶️🌶️",
    HOT: "🌶️🌶️🌶️",
    EXTRA_HOT: "🌶️🌶️🌶️🌶️",
};

export default function MealDetailsContent({ meal }: MealDetailsContentProps) {
    const [activeImage, setActiveImage] = useState(meal.image);
    const [quantity, setQuantity] = useState(1);
    const [showReviewsMore, setShowReviewsMore] = useState(false);
    const router = useRouter();

    const isAvailable = meal.availabilityStatus === "AVAILABLE";
    const canOrder = isAvailable && meal.stockQuantity > 0;

    const totalPrice = meal.finalPrice * quantity;

    const displayedReviews = showReviewsMore ? mockReviews : mockReviews.slice(0, 2);

    // Extract YouTube/Vimeo embed URL
    const getVideoEmbedUrl = (url: string) => {
        if (!url) return null;

        // YouTube
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
        if (youtubeMatch) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
        }

        // Vimeo
        const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
        if (vimeoMatch) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
        }

        // Direct video URL
        return url;
    };

    const handleAddToCart = async () => {
        if (!canOrder) return;

        const res = await addToCart(meal.id, quantity);

        if(res.success){
            toast.success(res.message || "Added to cart!");
            router.push("/cart");
        }
        else{
            toast.error(res.errorMessage || "Failed to add to cart. Please try again.");
        }
    }

    return (
        <main className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 pb-16">
            {/* Top Banner Decor */}
            <div className="absolute top-0 left-0 h-64 w-full bg-linear-to-b from-orange-100/40 to-transparent pointer-events-none dark:from-orange-900/10" />

            <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-8">

                {/* --- Breadcrumb --- */}
                <nav className="mb-8 flex items-center gap-2 text-sm font-medium">
                    <Link href="/meals" className="text-slate-400 transition-colors hover:text-orange-600">Meals</Link>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                    <Link href={`/meals?cuisine=${meal.cuisineName}`} className="text-slate-400 transition-colors hover:text-orange-600">{meal.cuisineName}</Link>
                    <ChevronRight className="h-4 w-4 text-slate-300" />
                    <span className="text-orange-600 font-bold">{meal.name}</span>
                </nav>

                <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                    {/* --- LEFT: Image Gallery (5 Columns) --- */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="relative group aspect-square overflow-hidden rounded-[2.5rem] bg-white shadow-2xl shadow-orange-200/40 dark:shadow-none border border-white">
                            <Image
                                src={activeImage}
                                alt={meal.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />

                            {/* Badges Overlay */}
                            <div className="absolute top-5 left-5 flex flex-col gap-2">
                                {meal.isFeatured && (
                                    <div className="flex items-center gap-1.5 bg-amber-400 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        <Star className="h-3 w-3 fill-current" /> Featured
                                    </div>
                                )}
                                {meal.isPopular && (
                                    <div className="flex items-center gap-1.5 bg-rose-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        <Flame className="h-3 w-3 fill-current" /> Popular
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="absolute top-5 right-5 flex flex-col gap-3">
                                <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm text-slate-400 hover:text-rose-500 transition-all active:scale-90">
                                    <Heart className="h-5 w-5" />
                                </button>
                                <button className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-sm text-slate-400 hover:text-blue-500 transition-all active:scale-90">
                                    <Share2 className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Availability Overlay */}
                            <div className="absolute bottom-5 left-5">
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl backdrop-blur-md text-white text-xs font-bold shadow-xl ${isAvailable ? 'bg-emerald-500/90' : 'bg-red-500/90'}`}>
                                    {isAvailable ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                    {isAvailable ? "In Stock" : "Out of Stock"}
                                </div>
                            </div>
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {meal.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border-4 transition-all duration-300 ${activeImage === img ? "border-orange-500 scale-105 shadow-md" : "border-white opacity-60 hover:opacity-100"
                                        }`}
                                >
                                    <Image src={img} alt="thumb" fill unoptimized className="object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* --- RIGHT: Content (7 Columns) --- */}
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest bg-orange-50 w-fit px-3 py-1 rounded-lg">
                                <UtensilsCrossed className="h-3.5 w-3.5" /> {meal.categoryName}
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white leading-[1.1]">
                                {meal.name}
                            </h1>

                            <div className="flex items-center gap-6 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="flex bg-amber-50 px-2 py-1 rounded-lg">
                                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                        <span className="ml-1.5 font-black text-slate-900">4.8</span>
                                    </div>
                                    <span className="text-sm font-medium text-slate-400">({mockReviews.length} Reviews)</span>
                                </div>
                                <div className="h-4 w-px bg-slate-200" />
                                <div className="flex items-center gap-2 text-sm font-bold text-slate-600">
                                    <Clock className="h-4 w-4 text-orange-500" /> {meal.preparationTime} mins
                                </div>
                            </div>

                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                                {meal.description}
                            </p>
                        </div>

                        {/* Quick Specs Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: Clock, label: "Prep Time", value: `${meal.preparationTime} min`, color: "text-orange-500", bg: "bg-orange-50" },
                                { icon: Leaf, label: "Dietary", value: meal.dietaryTag, color: "text-emerald-500", bg: "bg-emerald-50" },
                                { icon: Flame, label: "Spice", value: spiceLevelEmoji[meal.spiceLevel] || meal.spiceLevel, color: "text-red-500", bg: "bg-red-50" },
                                { icon: MapPin, label: "Servings", value: meal.servingSize || "1 serving", color: "text-blue-500", bg: "bg-blue-50" }
                            ].map((spec, i) => (
                                <div key={i} className={`${spec.bg} p-4 rounded-3xl border border-white dark:bg-slate-900 shadow-sm transition-transform hover:-translate-y-1`}>
                                    <spec.icon className={`h-5 w-5 ${spec.color} mb-2`} />
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{spec.label}</p>
                                    <p className="text-sm font-black text-slate-900 dark:text-white">{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* Price & Checkout Card */}
                        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-orange-100/20 dark:shadow-none">
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Price</p>
                                    <div className="flex items-end gap-3">
                                        <span className="text-5xl font-black text-slate-900 dark:text-white leading-none">৳{meal.finalPrice.toFixed(0)}</span>
                                        {meal.discount > 0 && (
                                            <div className="flex flex-col">
                                                <span className="text-xl text-slate-300 line-through leading-none">৳{Math.round(meal.finalPrice / (1 - meal.discount / 100))}</span>
                                                <span className="text-xs font-black text-emerald-500">SAVE {meal.discount}%</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 p-2 rounded-2xl">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:text-orange-600 transition-all"><Minus className="h-4 w-4" /></button>
                                    <span className="min-w-8 text-center text-xl font-black">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="h-10 w-10 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:text-orange-600 transition-all"><Plus className="h-4 w-4" /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                onClick={handleAddToCart}
                                    disabled={!canOrder}
                                    className={`cursor-pointer flex h-16 items-center justify-center gap-3 rounded-4xl font-black text-lg transition-all active:scale-95 ${canOrder ? 'bg-slate-900 text-white hover:bg-black shadow-lg shadow-slate-200' : 'cursor-not-allowed bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    <ShoppingCart className="h-5 w-5" />
                                    {isAvailable ? "Add to Cart" : "Out of Stock"}
                                </button>
                                <button
                                    disabled={!canOrder}
                                    className={`flex h-16 items-center justify-center rounded-4xl font-black text-lg transition-all active:scale-95 ${canOrder ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-100' : 'cursor-not-allowed bg-slate-200 text-slate-400'
                                        }`}
                                >
                                    {isAvailable ? `Buy Now • ৳${totalPrice.toFixed(0)}` : "Out of Stock"}
                                </button>
                            </div>

                            {meal.stockQuantity < 10 && meal.stockQuantity > 0 && (
                                <p className="mt-4 text-center text-xs font-bold text-orange-600 animate-pulse">
                                    ⚠️ Hurry! Only {meal.stockQuantity} servings left in stock
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- INGREDIENTS --- */}
                <section className="mt-20">
                    <div className="flex items-center gap-3 mb-8">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Ingredients</h2>
                        <div className="h-px flex-1 bg-slate-100" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                        {meal.ingredients.map((ingredient, idx) => (
                            <div key={idx} className="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm hover:border-orange-200 hover:shadow-md transition-all">
                                <p className="font-bold text-slate-800 dark:text-slate-200">{ingredient}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* --- VIDEO SECTION (If exists) --- */}
                {meal.videoUrl && (
                    <section className="mt-20">
                        <div className="flex items-center gap-3 mb-8">
                                <h2 className="flex items-center gap-3 text-3xl font-black text-slate-900 dark:text-white">
                                <PlayCircle className="text-orange-500" /> Watch Recipe Video
                            </h2>
                        </div>
                        <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[3rem] border-8 border-white shadow-2xl aspect-video">
                            <iframe
                                src={getVideoEmbedUrl(meal.videoUrl) || undefined}
                                title="video"
                                className="w-full h-full"
                            />
                        </div>
                    </section>
                )}

                {/* --- REVIEWS --- */}
                <section className="mt-20">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white">Customer Reviews</h2>
                        <div className="flex items-center gap-2 font-bold text-orange-600">
                            {mockReviews.length} reviews <ChevronRight className="h-4 w-4" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {displayedReviews.map((review) => (
                            <div key={review.id} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-50 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-all" />
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-orange-400 to-orange-600 font-black text-white shadow-lg shadow-orange-100">
                                            {review.avatar}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-black text-slate-900 dark:text-white">{review.name}</p>
                                                {review.verified && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />}
                                            </div>
                                            <p className="text-xs text-slate-400 font-medium">{review.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-100'}`} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-slate-300 leading-relaxed italic">{review.text}</p>
                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                    <span className="flex items-center gap-1 cursor-pointer transition-colors hover:text-orange-500">👍 Helpful votes ({review.helpful})</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {mockReviews.length > 2 && (
                        <button
                            onClick={() => setShowReviewsMore(!showReviewsMore)}
                            className="mt-10 w-full rounded-2xl border-2 border-dashed border-slate-200 py-5 font-black text-slate-400 transition-all hover:border-orange-500 hover:text-orange-600"
                        >
                            {showReviewsMore ? "Show less" : `View all ${mockReviews.length} reviews`}
                        </button>
                    )}
                </section>
            </div>
        </main>
    );
}
