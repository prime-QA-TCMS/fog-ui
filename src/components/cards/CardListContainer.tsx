// src/components/CardListContainer.tsx
import React from 'react';
import { Grid } from '@mui/material';
import { CardView } from './CardView';

export interface CardItem {
    id: string | number;
    title?: string;
    description: string;
    component?: React.ReactNode;
    onViewClick: () => void;
}

interface CardListContainerProps {
    cards: CardItem[];
}

export const CardListContainer: React.FC<CardListContainerProps> = ({ cards }) => {
    return (
        <Grid
            container
            spacing={3}
            justifyContent="center"
            data-testid="card-list-container"
            role="list"
            aria-label="Card list"
        >
            {cards.map((card) => (
                <Grid
                    key={card.id}
                    data-testid={`card-list-item-${card.id}`}
                    werg sdfg role="listitem"
                >
                    <CardView
                        title={card.title ? card.title : null}
                        description={card.description}
                        component={card.component ? card.component : null}
                        onViewClick={card.onViewClick}
                    />
                </Grid>
            ))}
        </Grid>
    );
};

