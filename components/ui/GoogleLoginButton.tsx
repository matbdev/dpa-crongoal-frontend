import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

interface GoogleLoginLinkProps {
    href: string;
}

export default function GoogleLoginLink({ href }: GoogleLoginLinkProps) {
    return (
        <Link
            href={href}
            className="flex items-center justify-center w-full gap-3 px-4 py-2.5 text-sm font-medium transition-colors border rounded-md shadow-sm bg-bg-sidebar border-border-card hover:bg-hover-sidebar focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-main"
        >
            <FcGoogle size={22} />
            <span>Continuar com o Google</span>
        </Link>
    );
}