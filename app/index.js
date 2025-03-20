import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Alert,
  Platform
} from 'react-native';
// import { launchImageLibrary } from 'react-native-image-picker';
import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import globalState from '../scripts/globalState';

// 预设图标
const PRESET_ICONS = [
  { id: 'mouse', name: '老鼠', icon: 'mouse' },
  { id: 'bug', name: '虫子', icon: 'bug' },
  { id: 'butterfly', name: '蝴蝶', icon: 'butterfly' },
  { id: 'bird', name: '小鸟', icon: 'bird' },
  { id: 'fish', name: '鱼', icon: 'fish' },
  { id: 'spider', name: '蜘蛛', icon: 'spider' },
  { id: 'ladybug', name: '瓢虫', icon: 'ladybug' },
  { id: 'dot', name: '小点', icon: 'circle-small' },
];

// 预设颜色
const PRESET_COLORS = [
  { name: '白色', value: '#FFFFFF' },
  { name: '黄色', value: '#FFFACD' },
  { name: '红色', value: '#FFDEAD' },
  { name: '粉色', value: '#FFC0CB' },
  { name: '蓝色', value: '#87CEFA' },
  { name: '绿色', value: '#008B45' },
  { name: '紫色', value: '#6A5ACD' },
  { name: '灰色', value: '#CCCCCC' },
];

const Settings = () => {
  const router = useRouter();
  const [selectedIcon, setSelectedIcon] = useState(PRESET_ICONS[0]);
  const [customIcon, setCustomIcon] = useState(null);
  const [backgroundColor, setBackgroundColor] = useState(PRESET_COLORS[0].value);
  const [speed, setSpeed] = useState(5); // 1-10
  const [showColorPicker, setShowColorPicker] = useState(false);

  // 更新背景色
  useEffect(() => {
    // 当背景色改变时，更新页面背景色
  }, [backgroundColor]);

  // 选择预设图标
  const selectPresetIcon = (icon) => {
    setSelectedIcon(icon);
    setCustomIcon(null);
  };

  // 上传自定义图标
//   const uploadCustomIcon = () => {
//     const options = {
//       mediaType: 'photo',
//       includeBase64: true,
//       maxHeight: 200,
//       maxWidth: 200,
//     };

//     launchImageLibrary(options, (response) => {
//       if (response.didCancel) {
//         console.log('用户取消了图片选择');
//       } else if (response.errorCode) {
//         console.log('图片选择错误: ', response.errorMessage);
//         Alert.alert('错误', '选择图片时出错');
//       } else {
//         const source = { uri: response.assets[0].uri };
//         setCustomIcon(source);
//         setSelectedIcon(null);
//       }
//     });
//   };

  // 选择预设颜色
  const selectPresetColor = (color) => {
    setBackgroundColor(color.value);
    setShowColorPicker(false);
  };

  // 开始游戏
  const startGame = () => {
    // 设置全局参数
    globalState.setGameParams({
      icon: customIcon ? customIcon : selectedIcon,
      backgroundColor: backgroundColor,
      speed: speed,
    });
    
    // 导航到游戏页面
    router.push('/game');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>选择图标</Text>
        <View style={styles.iconsContainer}>
          {PRESET_ICONS.map((icon) => (
            <TouchableOpacity
              key={icon.id}
              style={[
                styles.iconButton,
                selectedIcon && selectedIcon.id === icon.id && styles.selectedIconButton,
              ]}
              onPress={() => selectPresetIcon(icon)}
            >
              <Icon name={icon.icon} size={30} color="#333" />
              <Text style={styles.iconText}>
                {/* {icon.name} */}
                </Text>
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity
            style={[styles.iconButton, customIcon && styles.selectedIconButton]}
            onPress={uploadCustomIcon}
          >
            {customIcon ? (
              <Image source={customIcon} style={styles.customIcon} />
            ) : (
              <Icon name="upload" size={30} color="#333" />
            )}
            <Text style={styles.iconText}>上传图片</Text>
          </TouchableOpacity> */}
        </View>

        <Text style={styles.sectionTitle}>选择背景色</Text>
        <View style={styles.colorsContainer}>
          {PRESET_COLORS.map((color) => (
            <TouchableOpacity
              key={color.name}
              style={[
                styles.colorButton,
                { backgroundColor: color.value },
                backgroundColor === color.value && styles.selectedColorButton,
              ]}
              onPress={() => selectPresetColor(color)}
            >
              <Text style={[
                styles.colorText,
                color.value === '#FFFFFF' || color.value === '#FFFF00' ? { color: '#000' } : { color: '#FFF' }
              ]}>
                {/* {color.name} */}
              </Text>
            </TouchableOpacity>
          ))}
          {/* <TouchableOpacity
            style={[styles.colorButton, styles.customColorButton]}
            onPress={() => setShowColorPicker(!showColorPicker)}
          >
            <Text style={styles.colorText}>自定义</Text>
          </TouchableOpacity> */}
        </View>

        {showColorPicker && (
          <View style={styles.colorPickerContainer}>
            <ColorPicker
              onColorSelected={(color) => {
                setBackgroundColor(color);
                setShowColorPicker(false);
              }}
              style={{ flex: 1, height: 200 }}
              defaultColor={backgroundColor}
            />
          </View>
        )}

        <Text style={styles.sectionTitle}>调整速度</Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.speedText}>慢</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={speed}
            onValueChange={setSpeed}
            minimumTrackTintColor="#4CAF50"
            maximumTrackTintColor="#000000"
            thumbTintColor="#4CAF50"
          />
          <Text style={styles.speedText}>快</Text>
          <Text style={styles.speedValue}>{speed}</Text>
        </View>

        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>开始游戏</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  iconsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: '23%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  selectedIconButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
  customIcon: {
    width: 40,
    height: 40,
    borderRadius: 5,
  },
  colorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  colorButton: {
    width: '23%',
    aspectRatio: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColorButton: {
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  customColorButton: {
    backgroundColor: '#f0f0f0',
  },
  colorText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  colorPickerContainer: {
    height: 250,
    marginVertical: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  speedText: {
    width: 30,
    textAlign: 'center',
  },
  speedValue: {
    width: 30,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Settings; 