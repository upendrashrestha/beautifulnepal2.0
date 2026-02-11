"use client";

import { NEPAL_CITIES } from "@/utils/constant";
import { EventSpecParams } from "@/types/event.types";
import { useRouter } from "next/navigation";
import EventSearch from "@/components/events/EventSearch";

interface Props {
    initialParams?: EventSpecParams;
}

export default function EventSearchClient({ initialParams }: Props) {
    const router = useRouter();

    const handleSearch = (searchParams: EventSpecParams) => {
        // Merge with initial params
        const mergedParams: EventSpecParams = {
            ...initialParams,
            ...searchParams,
            pageIndex: 1, // reset page
        };

        const query = new URLSearchParams();
        if (mergedParams.pageIndex !== undefined) query.set("pageIndex", mergedParams.pageIndex.toString());
        if (mergedParams.pageSize !== undefined) query.set("pageSize", mergedParams.pageSize.toString());
        if (mergedParams.search) query.set("search", mergedParams.search);
        if (mergedParams.city) query.set("city", mergedParams.city);
        if (mergedParams.sort) query.set("sort", mergedParams.sort);
        if (mergedParams.status) query.set("status", mergedParams.status);
        if (mergedParams.type) query.set("type", mergedParams.type);
        if (mergedParams.id) query.set("id", mergedParams.id);
        if (mergedParams.publicId) query.set("publicId", mergedParams.publicId);
        if (mergedParams.timeFilter) query.set("timeFilter", mergedParams.timeFilter);

        router.push(`/events?${query.toString()}`);
    };

    return <EventSearch cities={NEPAL_CITIES} onSearch={handleSearch} />;
}