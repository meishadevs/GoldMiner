/**
 * 存放游戏中用到的一些配置信息
 */

//标记是否播放背景音乐
var bgVolume = 1;

//标记是否播放游戏音效
var effVolume = 1;

//窗口的宽度
var width = 800;

//窗口的高度
var height = 480;

//创建数组,保存创建游戏场景的名称所用到的图片
var arrayTitle = [0, res.baoxiang_png, res.tongtianhe_png, res.nverguo_png, res.huoyanshan_png, res.lingshan_png];

//保存创建倒计时动画用到的图片资源
var arrayAnimation = [res.start3_png, res.start2_png, res.start1_png, res.start_png];

//保存矿石的分值,type表示数组的下标
var arrayScore = [0, 0, 430, 50, 100, 250, 10, 20, 50, 700, 50, 100,
    50, 50, 50, 50, 50, 5];

//游戏场景的索引
var indexSceneGame = 1;

//关卡数
var indexLevel = 1;

var map = null;

//标记倒计时动画
var animationIndex = null;

var timeDialog = null;

//暂停对话框
var pauseDialog = null;

//显示游戏的剩余时间
var labelTime = null;

//显示游戏中的得分进度
var progressScore = null;

//显示游戏的关卡和场景编号
var labelLevel = null;

//显示游戏得分和过关目标分
var labelScore = null;

//游戏时间
var numTime = null;

//游戏角色
var player = null;

//精灵帧缓存对象
var frameCache = null;

//绳子
var shengzi = null;

//钩子
var gouzi = null;

//裁剪结点
var clipNode = null;

//用于创建绳子摇摆的动作
var shengziAction = null;

var playerAnimate = null;

//标记能否触摸屏幕
var isTouch = false;

//绳子的描点
var anchorX = null;
var anchorY = null;

//绳子的长度
var shengziLength = null;

//创建保存矿石的队列
var vecMineral = [];

//绳子最低点的坐标
var minX = null;
var minY = null;

//记录isOutofWindows函数的调用次数
var time = null;

//用于创建游戏角色拉绳子时的动画
var repShengzi = null;

//绳子的旋转角度
var shengziAngle = null;

//标记绳子摇摆的方向
//true = 表示向右摇摆
//false = 表示向左摇摆
var isDirection = null;

//游戏得分
var numScore = 0;

//过关目标分
var airmScore = 0;

//标记能否点击返回按钮
var isClick = null;

var layerColor = null;
var helpDialog = null;
var buttonPageLeft = null;
var buttonPageRight = null;
var spriteInfo = null;
var indexPage = 0;

//用于创建游戏失败时弹出的对话框
var failGameDialog = null;

//用于创建游戏成功时弹出的对话框
var successGameDialog = null;

var particle = null;

//判断钩子上是否抓了矿石
var isGouzi = null;

//保存每关的过关分数
var vecScore = null;

//精灵帧缓存
var spriteFrameCache = null;