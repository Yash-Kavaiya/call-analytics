import { BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils'; // Assuming utils exists, if not I'll use simple string concatenation or clsx if available

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, showText = true, size = 'md' }: LogoProps) {
    const sizeClasses = {
        sm: { icon: 'h-6 w-6', iconInner: 'h-4 w-4', text: 'text-lg' },
        md: { icon: 'h-8 w-8', iconInner: 'h-5 w-5', text: 'text-xl' },
        lg: { icon: 'h-10 w-10', iconInner: 'h-6 w-6', text: 'text-2xl' },
    };

    const { icon, iconInner, text } = sizeClasses[size];

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn(icon, "rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-400 flex items-center justify-center")}>
                <BarChart2 className={cn(iconInner, "text-white")} />
            </div>
            {showText && (
                <span className={cn(text, "font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-400")}>
                    Prism
                </span>
            )}
        </div>
    );
}
