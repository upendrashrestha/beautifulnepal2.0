'use client';

import { useMemo, useState, forwardRef, useImperativeHandle } from "react";

export interface BotCheckRef {
    clear: () => void;
}

interface BotCheckProps {
    error?: string;
    onVerified: (passed: boolean) => void;
}

const BotCheck = forwardRef<BotCheckRef, BotCheckProps>(
    ({ error, onVerified }, ref) => {
        const [answer, setAnswer] = useState("");
        const [seed, setSeed] = useState(0); // forces new question

        const question = useMemo(() => {
            const num1 = Math.floor(Math.random() * 10) + 1;
            const num2 = Math.floor(Math.random() * 10) + 1;
            return { num1, num2, answer: num1 + num2 };
        }, [seed]);

        const handleChange = (value: string) => {
            setAnswer(value);
            onVerified(Number(value) === question.answer);
        };

        useImperativeHandle(ref, () => ({
            clear() {
                setAnswer("");
                onVerified(false);
                setSeed((s) => s + 1); // regenerate question
            },
        }));

        return (
            <div className="space-y-4 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <svg className="w-6 h-6 mr-2 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                    </svg>
                    Security Check
                </h2>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                        What is {question.num1} + {question.num2}? *
                    </label>

                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => handleChange(e.target.value)}
                        placeholder="Enter your answer"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    />

                    {error && (
                        <p className="mt-1 text-sm text-red-500">{error}</p>
                    )}
                </div>
            </div>
        );
    }
);

BotCheck.displayName = "BotCheck";
export default BotCheck;
