import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Dimensions,
    TouchableWithoutFeedback,
    Image,
    BackHandler,
    Animated,
    Easing,
    Pressable,
    TouchableOpacity,
    Text,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useKeepAwake } from 'expo-keep-awake';
import globalState from '../scripts/globalState';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const GameScreen = () => {
    useKeepAwake(); // 保持屏幕常亮
    const router = useRouter();
    
    // 从全局状态获取参数
    const gameParams = globalState.getGameParams();
    console.log('从全局状态获取的参数:', gameParams);
    
    const icon = gameParams.icon;
    const backgroundColor = gameParams.backgroundColor;
    const speed = gameParams.speed;

    // 图标大小
    const ICON_SIZE = 60;

    // 图标位置动画值
    const positionX = useRef(new Animated.Value(SCREEN_WIDTH / 2 - ICON_SIZE / 2)).current;
    const positionY = useRef(new Animated.Value(SCREEN_HEIGHT / 2 - ICON_SIZE / 2)).current;

    // 是否被按压
    const [isPressing, setIsPressing] = useState(false);

    // 动画引用
    const animationRef = useRef(null);

    // 进入游戏界面时隐藏状态栏
    useEffect(() => {
        StatusBar.setHidden(true, 'fade');

        // 退出游戏界面时恢复状态栏
        return () => {
            StatusBar.setHidden(false, 'fade');
        };
    }, []);

    // 计算速度因子 (1-10 => 100-1000ms)
    const getSpeedFactor = () => {
        return 1100 - (speed * 100);
    };

    // 停止当前动画的辅助函数
    const stopCurrentAnimation = () => {
        if (animationRef.current) {
            animationRef.current.stop();
            animationRef.current = null;
        }
    };

    // 计算两点之间的距离
    const calculateDistance = (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    };

    // 随机移动图标
    const moveIcon = () => {
        // 检查状态，如果正在按压，不执行动画
        if (isPressing) {
            console.log("正在按压，不移动");
            return;
        }

        // 先确保停止任何现有动画
        stopCurrentAnimation();

        // 获取当前位置
        const currentX = positionX._value;
        const currentY = positionY._value;

        // 计算新的随机位置，避开边界
        const newX = Math.random() * (SCREEN_WIDTH - ICON_SIZE);
        const newY = Math.random() * (SCREEN_HEIGHT - ICON_SIZE);

        // 计算距离
        const distance = calculateDistance(currentX, currentY, newX, newY);

        // 修改后的速度计算
        // 基准速度提高到300像素/秒，并且使用更陡峭的速度曲线
        // 将速度范围从1-10映射到5-20的效果
        const baseSpeed = 300; // 基准速度提高3倍
        const minSpeedMultiplier = 0.5; // 相当于原本的5
        const maxSpeedMultiplier = 2.0; // 相当于原本的20

        // 线性映射：将1-10映射到0.5-2.0
        const speedMultiplier = minSpeedMultiplier + (speed - 1) * (maxSpeedMultiplier - minSpeedMultiplier) / 9;

        const moveSpeed = baseSpeed * speedMultiplier; // 实际速度
        const duration = Math.max(100, (distance / moveSpeed) * 1000); // 转换为毫秒，设置最小值防止过快
//        window.document.getElementById("new").innerHTML = `从(${currentX.toFixed(1)},${currentY.toFixed(1)})移动到(${newX.toFixed(1)},${newY.toFixed(1)})`;
        console.log(`从(${currentX.toFixed(1)},${currentY.toFixed(1)})移动到(${newX.toFixed(1)},${newY.toFixed(1)})，距离=${distance.toFixed(1)}像素，速度级别=${speed}，实际速度=${moveSpeed.toFixed(0)}像素/秒，时长=${duration.toFixed(0)}毫秒`);

        // 创建动画
        const animation = Animated.parallel([
            Animated.timing(positionX, {
                toValue: newX,
                duration: duration,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
            Animated.timing(positionY, {
                toValue: newY,
                duration: duration,
                easing: Easing.linear,
                useNativeDriver: false,
            }),
        ]);

        // 保存动画引用
        animationRef.current = animation;

        // 启动动画
        animation.start(({ finished }) => {
            // 只有动画正常完成（而不是被停止）且不在按压状态时才继续
            if (finished && !isPressing) {
                console.log("动画完成，继续移动");
                moveIcon();
            } else {
                console.log("动画被停止或在按压状态，不继续移动");
            }
        });
    };

    // 处理按压开始
    const handlePressIn = (e) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        console.log("按压开始 - 停止动画");

        // 先设置状态，这样可以防止moveIcon函数被调用
        setIsPressing(true);

        // 立即停止当前动画
        stopCurrentAnimation();
    };

    // 处理按压结束
    const handlePressOut = (e) => {
        if (e && e.stopPropagation) {
            e.stopPropagation();
        }

        console.log("按压结束 - 恢复移动");

        // 更新状态
        setIsPressing(false);
        // 不需要在这里调用moveIcon，因为useEffect会处理
    };

    // 处理返回按钮
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                router.back();
                return true;
            };

            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => {
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
                stopCurrentAnimation();
            };
        }, [router])
    );

    // 组件挂载时开始移动
    useEffect(() => {
        moveIcon();
        // 组件卸载时停止动画
        return () => {
            stopCurrentAnimation();
        };
    }, []);

    // 监听按压状态变化
    useEffect(() => {
        console.log("按压状态变化:", isPressing);

        if (isPressing) {
            // 确保动画停止
            console.log("停止所有动画");
            stopCurrentAnimation();
        } else {
            // 短暂延迟后开始移动
            const timer = setTimeout(() => {
                console.log("开始移动");
                moveIcon();
            }, 50);

            return () => clearTimeout(timer);
        }
    }, [isPressing]);

    // 渲染图标
    const renderIcon = () => {
        if (icon.uri) {
            // 自定义图片
            return (
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            left: positionX,
                            top: positionY,
                        },
                    ]}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                        style={styles.pressableArea}
                    >
                        <Image source={icon} style={styles.customIcon} />
                    </TouchableOpacity>
                </Animated.View>
            );
        } else {
            // 预设图标
            return (
                <Animated.View
                    style={[
                        styles.iconContainer,
                        {
                            left: positionX,
                            top: positionY,
                        },
                    ]}
                    pointerEvents="box-none"
                >
                    <TouchableOpacity
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        activeOpacity={0.7}
                        style={styles.pressableArea}
                    >
                        <Icon name={icon.icon} size={ICON_SIZE} color="#333" />
                    </TouchableOpacity>
                </Animated.View>
            );
        }
    };

    // 处理背景点击
    const handleBackgroundPress = () => {
        // 点击背景时不做任何操作
        console.log("背景被点击");
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            {renderIcon()}

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.back()}
            >
                <Icon name="arrow-left" size={24} color="#333" />
            </TouchableOpacity>
            {/* <Text>
                屏幕宽度:{SCREEN_WIDTH}；
                屏幕高度:{SCREEN_HEIGHT}；
            </Text> */}
            {/* <Text id='new'></Text> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    iconContainer: {
        position: 'absolute',
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // 确保图标在最上层
    },
    pressableArea: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    customIcon: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
    },
    pressed: {
        opacity: 0.7,
        transform: [{ scale: 0.95 }],
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 20,
        zIndex: 20,
    }
});

export default GameScreen; 