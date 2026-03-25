import { LocationData } from '@/types/location';
import { LocationTabType, ProfileTabType } from '@/types/types';
import React, { Component, ReactNode } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from '@/lib/utils';


interface TabsProps<T extends LocationTabType | ProfileTabType> {
    className?: string;
    defalutValue: T;
    tabs: { key: T; label: string }[];
    bodys: ReactNode[];
}

const TabsContainer = <T extends LocationTabType | ProfileTabType>(props: TabsProps<T>) => {
    return (
        <div className={cn('w-full h-full flex flex-col overflow-hidden', props.className)}>
            <Tabs defaultValue={props.defalutValue} className="flex flex-col h-full overflow-hidden">
                <TabsList className={'w-full shrink-0 bg-black'} variant="line">
                    {
                        props.tabs.map((tab, index) =>
                            <TabsTrigger className="" key={index} value={tab.key}>
                                {tab.label}
                            </TabsTrigger>
                        )
                    }
                </TabsList>
                <div className="flex-1 min-h-0 overflow-y-auto">
                    {
                        props.tabs.map((tab, index) =>
                            <TabsContent key={index} value={tab.key}>
                                {props.bodys[index]}
                            </TabsContent>
                        )
                    }
                </div>
            </Tabs>
        </div>
    );
}

export default TabsContainer;
