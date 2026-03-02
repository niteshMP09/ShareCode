import { Button } from '@/components/Button';

export type TabOption<T extends string> = {
    label: string;
    value: T;
};

type TabToggleProps<T extends string> = {
    value: T;
    options: TabOption<T>[];
    onChange: (value: T) => void;
    className?: string;
};

export function TabToggle<T extends string>({
    value,
    options,
    onChange,
    className = '',
}: TabToggleProps<T>) {
    return (
        <div className={`flex gap-1 bg-gray-100 rounded-xl p-1 ${className}`}>
            {options.map((option) => (
                <Button
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${value === option.value
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    {option.label}
                </Button>
            ))}
        </div>
    );
}
