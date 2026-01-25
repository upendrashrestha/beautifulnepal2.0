interface StepperProps {
    step: number;
}

const steps = [
    { id: 1, label: "Listing" },
    { id: 2, label: "Itinerary?" },
    { id: 3, label: "Itinerary Details" },
];

export default function Stepper({ step }: StepperProps) {
    return (
        <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
                <div key={s.id} className="flex items-center w-full">
                    <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold
              ${step >= s.id ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"}`}
                    >
                        {s.id}
                    </div>

                    <span className="ml-2 text-sm font-medium">{s.label}</span>

                    {i < steps.length - 1 && (
                        <div className="flex-1 h-0.5 mx-3 bg-gray-300" />
                    )}
                </div>
            ))}
        </div>
    );
}
