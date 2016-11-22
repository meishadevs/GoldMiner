/**
 *存放设置游戏Ui的代码
 */

//添加地图
var addMap = function(self, fileName)
{
    map = new cc.TMXTiledMap("res/tmx/" + fileName + indexLevel + ".tmx");
    self.addChild(map);
    var group = map.getObjectGroup("logic");
    var arrayObjects = group.getObjects();

    var dict;

    for (var i = 0, len = arrayObjects.length; i < len; i++)
    {
        dict = arrayObjects[i];

        var x = dict["x"]
        var y = dict["y"];
        var width = dict["width"];
        var height = dict["height"];
        var type = dict["type"];

        var mineral = new cc.Sprite("res/tmx/goods_" + type + ".png");
        mineral.anchorX = 0;
        mineral.anchorY = 0;
        mineral.x = x;
        mineral.y = y;
        mineral.type = type;
        map.addChild(mineral);

        vecMineral.push(mineral);
    }
}

//添加暂停按钮
var addButton = function(self)
{
    var buttonPause = new ccui.Button();
    buttonPause.setTouchEnabled(true);
    buttonPause.loadTextures(res.zanting1_png, res.zanting2_png, "");
    buttonPause.x = width - 100;
    buttonPause.y = height - 100;
    moveNode(buttonPause, cc.p(50, 50));
    buttonPause.addTouchEventListener(openPauseDialog);
    self.addChild(buttonPause);
}

//加载使用CocosStudio搭建好的Ui
var loadCocosStudio = function(self)
{
    timeDialog = ccs.load(res.progressTime_json);
    timeDialog.node.anchorX = 0.5;
    timeDialog.node.anchorY = 0.5;
    timeDialog.node.x = 70;
    timeDialog.node.y = height - 60;
    moveNode(timeDialog.node, cc.p(-30, 18));
    self.addChild(timeDialog.node);

    layerColor = new cc.LayerColor(cc.color(0, 0, 0, 200), width, height);
    layerColor.visible = false;
    layerColor.setLocalZOrder(10);
    self.addChild(layerColor);

    pauseDialog = ccs.load(res.pauseDialog_json);
    pauseDialog.node.anchorX = 0.5;
    pauseDialog.node.anchorY = 0.5;
    pauseDialog.node.x = width / 2;
    pauseDialog.node.y = height / 2;
    pauseDialog.node.setLocalZOrder(10);
    pauseDialog.node.visible = false;
    self.addChild(pauseDialog.node);

    helpDialog = ccs.load(res.HelpDialog_json);
    helpDialog.node.anchorX = 0.5;
    helpDialog.node.anchorY = 0.5;
    helpDialog.node.x = 60;
    helpDialog.node.y = 450;
    helpDialog.node.setLocalZOrder(10);
    helpDialog.node.visible = false;
    self.addChild(helpDialog.node);

    failGameDialog = ccs.load(res.failGameDialog_json);
    failGameDialog.node.anchorX = 0.5;
    failGameDialog.node.anchorY = 0.5;
    failGameDialog.node.x = width / 2;
    failGameDialog.node.y = height / 2 + 20;
    failGameDialog.node.setLocalZOrder(10);
    failGameDialog.node.scale = 0;
    failGameDialog.node.opacity = 0;
    self.addChild(failGameDialog.node);

    successGameDialog = ccs.load(res.successGameDialog_json);
    successGameDialog.node.anchorX = 0.5;
    successGameDialog.node.anchorY = 0.5;
    successGameDialog.node.x = width / 2;
    successGameDialog.node.y = height / 2 + 20;
    successGameDialog.node.setLocalZOrder(10);
    successGameDialog.node.scale = 0;
    successGameDialog.node.opacity = 0;
    self.addChild(successGameDialog.node);
}

//获得节点的信息
var getNodeInfo = function(self)
{
    labelTime = timeDialog.node.getChildByName("labelTime");
    progressScore = timeDialog.node.getChildByName("progressScore");
    labelLevel = timeDialog.node.getChildByName("labelLevel");
    labelScore = timeDialog.node.getChildByName("labelScore");

    var buttonContinue = pauseDialog.node.getChildByName("buttonContinue");
    buttonContinue.addTouchEventListener(continueGame);

    var buttonReplay = pauseDialog.node.getChildByName("buttonReplay");
    buttonReplay.addTouchEventListener(self.replayGame);

    var buttonMenu = pauseDialog.node.getChildByName("buttonMenu");
    buttonMenu.addTouchEventListener(intoSceneMenu);

    var buttonHelp = pauseDialog.node.getChildByName("buttonHelp");
    buttonHelp.addTouchEventListener(openHelpDialog);

    var buttonCloseHelpDialog = helpDialog.node.getChildByName("closeHelpDialog");
    buttonCloseHelpDialog.addTouchEventListener(closeHelpDialog);

    buttonPageLeft = helpDialog.node.getChildByName("pageLeft");
    buttonPageLeft.addTouchEventListener(pageLeft);

    buttonPageRight = helpDialog.node.getChildByName("pageRight");
    buttonPageRight.addTouchEventListener(pageRight);

    spriteInfo = helpDialog.node.getChildByName("spriteInfo");

    var buttonReplay1 = failGameDialog.node.getChildByName("buttonReplay");
    buttonReplay1.addTouchEventListener(self.replayGame);

    var buttonMenu1 = failGameDialog.node.getChildByName("buttonMenu");
    buttonMenu1.addTouchEventListener(intoSceneMenu);

    var buttonMenu2 = successGameDialog.node.getChildByName("buttonMenu");
    buttonMenu2.addTouchEventListener(intoSceneMenu);

    var buttonStart = successGameDialog.node.getChildByName("buttonStart");
    buttonStart.addTouchEventListener(self.replayGame);

    var buttonLevel = successGameDialog.node.getChildByName("buttonLevel");
    buttonLevel.addTouchEventListener(intoNextLevel);
}

//设置游戏中用到的一些数据
var setData = function()
{
    labelTime.setString(numTime);
    progressScore.setPercent(0);
    labelLevel.setString(indexSceneGame + " - " + indexLevel);
    labelScore.setString(numScore + " / " + airmScore);
}

//添加游戏角色
var addPlayer = function(self, fileName, pt)
{
    player = new cc.Sprite(spriteFrameCache.getSpriteFrame(fileName));
    player.x = pt.x;
    player.y = pt.y;
    self.addChild(player);
}

//添加栅栏
var addGunLun = function(self, pt)
{
    var gunlun = new cc.Sprite(res.gunlun_png);
    gunlun.x = pt.x;
    gunlun.y = pt.y;
    self.addChild(gunlun);
}

//场景裁剪节点
var createClipNode = function(self)
{
    var masking = new cc.Sprite(res.masking_png);
    masking.anchorX = 0.5;
    masking.anchorY = 0;
    masking.x = width / 2;
    masking.y = height - 100;
    moveNode(masking, cc.p(0, -18));

    clipNode = new cc.ClippingNode();
    clipNode.setStencil(masking);
    clipNode.setInverted(true);
    clipNode.setAlphaThreshold(0.5);
    clipNode.anchorX = 0;
    clipNode.anchorY =0;
    clipNode.x = 0;
    clipNode.y = 0;
    self.addChild(clipNode);
}

//添加绳子
var addShengZi = function(pt)
{
    //创建绳子
    shengzi = new cc.Sprite(res.shengzi_png);
    shengzi.anchorX = anchorX;
    shengzi.anchorY = anchorY;
    shengzi.x = pt.x;
    shengzi.y = pt.y;
    shengzi.rotation = shengziAngle;
    clipNode.addChild(shengzi);

    //创建钩子
    gouzi = new cc.Sprite(res.gouzi_png);
    gouzi.anchorX = 0.5;
    gouzi.anchorY = 1;
    moveNode(gouzi, cc.p(3, 0));
    shengzi.addChild(gouzi);

    //获得绳子的长度
    shengziLength = shengzi.getContentSize().height;
}

//继续游戏
continueGame = function(sender, type)
{
    switch (type)
    {
        case  ccui.Widget.TOUCH_BEGAN:
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            isClick = true;
            isTouch = true;

            layerColor.visible = false;
            pauseDialog.node.visible = false;
            cc.director.resume();
        }
        break;
        default:
        break;
    }
}

//打开帮助对话框
openHelpDialog = function(sender, type)
{
    switch (type)
    {
        case  ccui.Widget.TOUCH_BEGAN:
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            pauseDialog.node.visible = false;
            helpDialog.node.visible = true;

            indexPage = 0;
            updatePageData();
        }
        break;
        default:
        break;
    }
}

//关闭帮助对话框
var closeHelpDialog = function(sender, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
        {
            if (effVolume)
            {
                //播放按钮音效
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            pauseDialog.node.visible = true;
            helpDialog.node.visible = false;
        }
        break;
        default:
        break;
    }
}

//向左翻页
var pageLeft = function(sender, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            indexPage--;
            updatePageData();
        }
        break;
        default:
        break;
    }
}

//向右翻页
var pageRight = function(sender, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            indexPage++;
            updatePageData();
        }
        break;
        default:
        break;
    }
}

//进入菜单场景
intoSceneMenu = function(sender, type)
{
    switch (type)
    {
        case  ccui.Widget.TOUCH_BEGAN:
        {
            if (effVolume)
            {
                //播放按钮音效
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            indexLevel = 1;

            cc.audioEngine.stopMusic(res.sound002_mp3);

            cc.director.resume();
            cc.director.runScene(new SceneMenu());
        }
        break;
        default:
        break;
    }
}

//进入下一关
intoNextLevel = function(sender, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_ENDED:
        {
            if (effVolume)
            {
                //播放按钮音效
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            indexLevel += 1;

            //进入宝象国
            if (indexSceneGame == 1)
            {
                if (indexLevel > 12)
                {
                    indexLevel = 1;
                }

                cc.audioEngine.stopMusic(res.sound002_mp3);
                cc.director.runScene(new SceneBaoXiangGuo());
            }
            //进入通天河
            else if (indexSceneGame == 2)
            {
                if (indexLevel > 11)
                {
                    indexLevel = 1;
                }

                cc.audioEngine.stopMusic(res.sound003_mp3);
                cc.director.runScene(new SceneTongTianHe());
            }
            //进入女儿国
            else if (indexSceneGame == 3)
            {
                if (indexLevel > 11)
                {
                    indexLevel = 1;
                }

                cc.audioEngine.stopMusic(res.sound004_mp3);
                cc.director.runScene(new SceneNvErGuo());
            }
            //进入火焰山
            else if (indexSceneGame == 4)
            {
                if (indexLevel > 11)
                {
                    indexLevel = 1;
                }

                cc.audioEngine.stopMusic(res.sound005_mp3);
                cc.director.runScene(new SceneHuoYanShan());
            }
            //进入灵山
            else if (indexSceneGame == 5)
            {
                if (indexLevel > 10)
                {
                    indexLevel = 1;
                }

                cc.audioEngine.stopMusic(res.sound006_mp3);
                cc.director.runScene(new SceneLingShan());
            }
        }
        break;
        default:
        break;
    }
}

//打开暂停对话框
openPauseDialog = function (sender, type)
{
    switch (type)
    {
        case ccui.Widget.TOUCH_BEGAN:
        {
            //如果不能点击返回按钮
            if (!isClick)
            {
                return;
            }

            if (effVolume)
            {
                //播放按钮音效
                cc.audioEngine.playEffect(res.sound010_mp3);
            }

            //标记不能再点击暂停按钮
            isClick = false;

            //标记不能触摸屏幕
            isTouch = false;

            layerColor.visible = true;
            pauseDialog.node.visible = true;
            cc.director.pause();
        }
        break;
        default :
        break;
    }
}

var addBackground = function(self, fileImage)
{
    var bg = new cc.Sprite(fileImage);
    bg.anchorX = 0;
    bg.anchorY = 0;
    bg.x = 0;
    bg.y = 0;
    self.addChild(bg);
}

