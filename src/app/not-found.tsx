// app/not-found.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button"; // if you’re using shadcn
import { motion } from "framer-motion";
import AuthNav from "@/components/auth-nav";

export default function NotFound() {
	return (
		<div className="h-screen ">
			<AuthNav />
			<div className="flex flex-col h-[80vh] items-center justify-center text-center space-y-4">
				<motion.h1
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="text-6xl font-bold text-gray-800"
				>
					404
				</motion.h1>

				<p className="text-gray-500 text-lg">
					Oops! The page you’re looking for doesn’t exist.
				</p>

				<Link href="/overview">
					<Button className="mt-4">Go Home</Button>
				</Link>
			</div>
		</div>
	);
}
