import React, { useState } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { GenericTabsProps } from './types';

export const GenericTabs: React.FC<GenericTabsProps> = ({ tabsData }) => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ width: '100%' }} data-testid="generic-tabs-container">
            <Tabs
                value={activeTab}
                onChange={handleChange}
                centered
                data-testid="generic-tabs"
                aria-label="Content tabs"
            >
                {tabsData.map((tab, index) => (
                    <Tab
                        key={index}
                        label={tab.label}
                        data-testid={`tab-${index}`}
                        id={`tab-${index}`}
                        aria-controls={`tabpanel-${index}`}
                        aria-label={tab.label}
                    />
                ))}
            </Tabs>

            <Box sx={{ padding: '20px', marginTop: '10px' }}>
                {tabsData.map((tab, index) => (
                    <div
                        key={index}
                        hidden={activeTab !== index}
                        role="tabpanel"
                        id={`tabpanel-${index}`}
                        aria-labelledby={`tab-${index}`}
                        data-testid={`tabpanel-${index}`}
                    >
                        {activeTab === index && tab.content}
                    </div>
                ))}
            </Box>
        </Box>
    );
};


