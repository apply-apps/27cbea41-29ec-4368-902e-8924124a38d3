// Filename: index.js
// Combined code from all files

import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, Alert, ScrollView } from 'react-native';

const GRID_SIZE = 16;
const CELL_SIZE = 20;
const TIME_INTERVAL = 100;

const getRandomCoordinates = () => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    return { x, y };
};

const Snake = ({ snake }) => {
    return (
        <>
            {snake.map((segment, index) => (
                <View
                    key={index}
                    style={[
                        styles.snake,
                        {
                            left: segment.x * CELL_SIZE,
                            top: segment.y * CELL_SIZE,
                        },
                    ]}
                />
            ))}
        </>
    );
};

const Food = ({ food }) => {
    return (
        <View
            style={[
                styles.food,
                {
                    left: food.x * CELL_SIZE,
                    top: food.y * CELL_SIZE,
                },
            ]}
        />
    );
};

export default function App() {
    const [snake, setSnake] = useState([{ x: 8, y: 8 }]);
    const [food, setFood] = useState(getRandomCoordinates());
    const [direction, setDirection] = useState('RIGHT');
    const [isGameOver, setIsGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const intervalRef = useRef(null);

    useEffect(() => {
        if (!isGameOver) {
            intervalRef.current = setInterval(moveSnake, TIME_INTERVAL);
            return () => clearInterval(intervalRef.current);
        }
    }, [snake, direction, isGameOver]);

    useEffect(() => {
        if (isGameOver) {
            Alert.alert('Game Over', `Your score: ${score}`, [{ text: 'Restart', onPress: restartGame }]);
        }
    }, [isGameOver]);

    const moveSnake = () => {
        const newHead = { ...snake[0] };

        if (direction === 'UP') newHead.y -= 1;
        if (direction === 'DOWN') newHead.y += 1;
        if (direction === 'LEFT') newHead.x -= 1;
        if (direction === 'RIGHT') newHead.x += 1;

        if (newHead.x >= GRID_SIZE || newHead.x < 0 || newHead.y >= GRID_SIZE || newHead.y < 0 || checkCollision(newHead)) {
            setIsGameOver(true);
            return;
        }

        const newSnake = [newHead, ...snake];

        if (newHead.x === food.x && newHead.y === food.y) {
            setFood(getRandomCoordinates());
            setScore(score + 1);
        } else {
            newSnake.pop();
        }

        setSnake(newSnake);
    };

    const checkCollision = (head) => {
        for (let segment of snake) {
            if (head.x === segment.x && head.y === segment.y) {
                return true;
            }
        }
        return false;
    };

    const restartGame = () => {
        setSnake([{ x: 8, y: 8 }]);
        setFood(getRandomCoordinates());
        setDirection('RIGHT');
        setIsGameOver(false);
        setScore(0);
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.title}>Snake Game</Text>
                <View style={styles.grid}>
                    <Snake snake={snake} />
                    <Food food={food} />
                </View>
                <View style={styles.controls}>
                    <TouchableOpacity onPress={() => setDirection('UP')} style={styles.button}>
                        <Text style={styles.buttonText}>UP</Text>
                    </TouchableOpacity>
                    <View style={styles.row}>
                        <TouchableOpacity onPress={() => setDirection('LEFT')} style={styles.button}>
                            <Text style={styles.buttonText}>LEFT</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDirection('DOWN')} style={styles.button}>
                            <Text style={styles.buttonText}>DOWN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setDirection('RIGHT')} style={styles.button}>
                            <Text style={styles.buttonText}>RIGHT</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={styles.score}>Score: {score}</Text>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: '5%',
    },
    scrollContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
    },
    grid: {
        width: GRID_SIZE * CELL_SIZE,
        height: GRID_SIZE * CELL_SIZE,
        backgroundColor: '#e0e0e0',
        position: 'relative',
    },
    controls: {
        marginVertical: 20,
        alignItems: 'center',
    },
    button: {
        margin: 5,
        backgroundColor: '#0d47a1',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    row: {
        flexDirection: 'row',
    },
    score: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    snake: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
    },
    food: {
        position: 'absolute',
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
    },
});