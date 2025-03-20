// 全局状态管理
const globalState = {
  // 游戏参数
  gameParams: {
    icon: null,
    backgroundColor: '#FFFFFF',
    speed: 5,
  },
  
  // 设置游戏参数
  setGameParams(params) {
    this.gameParams = {
      ...this.gameParams,
      ...params
    };
  },
  
  // 获取游戏参数
  getGameParams() {
    return this.gameParams;
  }
};

export default globalState; 