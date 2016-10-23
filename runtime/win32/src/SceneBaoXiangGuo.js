//宝象国场景
var BaoXiangGuoLayer = cc.Layer.extend(
{
    ctor:function ()
    {
        this._super();

        if (bgVolume)
        {
            //播放背景音乐
            cc.audioEngine.playMusic(res.sound002_mp3, true);
        }
        else
        {
            //停止播放背景音乐
            cc.audioEngine.stopMusic(res.sound002_mp3);
        }

        //初始化数据
        this.initData();

        //添加地图
        this.addMap();

        //添加按钮
        this.addButton();

        this.loadCocosStudio();

        this.getNodeInfo();

        this.setData();

        this.addPlayer();

        this.addGunLun();

        this.createClipNode();

        this.addShengZi();

        this.addTouch();

        //创建定时器,用于播放倒计时动画
        this.schedule(this.playStartGameAnimation, 0.5);

        return true;
    },

    //定时器回调函数,用于播放开始游戏时的动画
    playStartGameAnimation:function()
    {
        animationIndex += 1;

        if (animationIndex == 3)
        {
            //播放展示开始动画时的音效
            if (effVolume == 1)
            {
                cc.audioEngine.playEffect(res.sound083_mp3);
            }
        }
        else
        {
            //播放展示(3, 2, 1)的演示动画时的音效
            if (effVolume == 1)
            {
                cc.audioEngine.playEffect(res.sound082_mp3);
            }
        }

        var sprite = new cc.Sprite(arrayAnimation[animationIndex]);
        sprite.anchorX = 0.5;
        sprite.anchorY = 0.5;
        sprite.x = width / 2;
        sprite.y = height / 2;
        moveNode(sprite, cc.p(0, 40));
        sprite.scale = 0;
        sprite.opacity = 0;
        this.addChild(sprite);

        //缩放动作和淡入动作同时执行
        var sp = new cc.Spawn(
        new cc.ScaleTo(0.5, 1),
        new cc.FadeIn(0.5)
        );

        //先执行Spawn,再执行CallFunc::create
        var seq  = cc.sequence(
        sp,
        cc.callFunc(this.RemoveTimeAnimation, this, sprite)
        );

        sprite.runAction(seq);
    },

    //移除倒计时动画
    RemoveTimeAnimation:function(sprite)
    {
        sprite.removeFromParent();

        //如果播放完了倒计时动画
        if (animationIndex == 3)
        {
            animationIndex = -1;

            //关闭定时器
            this.unschedule(this.playStartGameAnimation);

            //开始游戏
            this.startGame();
        }
    },

    //开始游戏
    startGame:function()
    {
        //标记能触摸屏幕
        isTouch = true;

        //标记能点击返回按钮
        isClick = true;

        //创建定时器,用于刷新游戏时间
        this.schedule(this.updateGameTime, 1);

        //创建定时器,用于实现绳子左右摇摆
        this.schedule(this.playShengZiAction, 0.01);

        this.addParticle();
    },

    //添加特效
    addParticle:function()
    {
        //创建粒子
        particle = new cc.ParticleSystem(res.yezi2_plist);
        particle.x = width / 2;
        particle.y = height;
        particle.setLocalZOrder(9);
        this.addChild(particle);
    },

    //刷新游戏时间
    updateGameTime:function()
    {
        numTime--;
        labelTime.setString(numTime);

        //还剩5秒时,播放游戏快要结束时的警告动画
        if (numTime >= 1 && numTime <= 5)
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound030_mp3);
            }

            //播放游戏快要结束时的提示动画
            this.playWarningAnimation();
        }

        //如果游戏结束
        if (numTime <= 0)
        {
            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound029_mp3);
            }

            //标记不能再触摸了
            isTouch = false;

            //标记不能点击暂停按钮
            isClick = false;

            //显示半透明背景
            layerColor.visible = true;

            //绳子停止左右摇摆
            this.unschedule(this.playShengZiAction);

            //绳子停止升长
            this.unschedule(this.longRope);

            //绳子停止缩短
            this.unschedule(this.shortenRope);

            //停止刷新游戏时间
            this.unschedule(this.updateGameTime);

            //停止播放游戏玩家摇滚轮的动画
            if (repShengzi != null)
            {
                player.stopAction(repShengzi);
                repShengzi = null;
            }

            //树叶停止下落
            particle.removeFromParent();

            numScore = 500;

            //游戏失败
            if (numScore < airmScore)
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound017_mp3);
                }

                //缩放动作和淡入动作同时执行
                var sp = new cc.Spawn(
                    new cc.ScaleTo(0.5, 1),
                    new cc.FadeIn(0.5)
                );

                //弹出游戏失败对话框后播放粒子特效
                var seq= cc.sequence(
                    sp,
                    cc.callFunc(function ()
                    {
                        //创建粒子(实现下雪的效果)
                        particle = new cc.ParticleSystem(res.xuehua_plist);
                        particle.x = width / 2;
                        particle.y = height;
                        particle.setLocalZOrder(100);
                        this.addChild(particle);
                    },
                    this)
                );

                failGameDialog.node.runAction(seq);
            }
            //游戏成功
            else
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound018_mp3);
                }

                //显示游戏得分
                var label = successGameDialog.node.getChildByName("labelScore");
                label.setString(numScore);

                //显示过关目标分
                var labelAirmScore = successGameDialog.node.getChildByName("labelAirmScore");
                labelAirmScore.setString(airmScore);

                //缩放动作和淡入动作同时执行
                var sp = new cc.Spawn(
                    new cc.ScaleTo(0.5, 1),
                    new cc.FadeIn(0.5)
                );

                //弹出游戏失败对话框后播放粒子特效
                var seq = cc.sequence(
                    sp,
                    cc.callFunc(function ()
                    {
                        //创建定时器用于展示游戏成功时的粒子特效
                        this.schedule(this.genParticle, 0.5);
                    },
                    this)
                );

                successGameDialog.node.runAction(seq);
            }
        }
    },

    //产生游戏胜利时展示的粒子特效
    genParticle:function()
    {
        var ptX = Math.random() * width;

        //创建粒子
        particle = new cc.ParticleSystem(res.yanhua_plist);
        particle.x = ptX;
        particle.y = height - 50;
        particle.setLocalZOrder(100);
        this.addChild(particle);
    },

    //播放游戏快要结束时的提示动画
    playWarningAnimation:function()
    {
        var sprite = new cc.Sprite();
        sprite.x = 65;
        sprite.y = height - 60;
        moveNode(sprite, cc.p(-30, 18));
        this.addChild(sprite);

        //利用动画保存每一帧的图片
        var spriteAnima = new cc.Animation();

        for(var i = 1; i <=  6; i++)
        {
            var str = "res/texiao/daoshu/daoshu" + i + ".png";

            spriteAnima.addSpriteFrameWithFile(str);
        }

        //每一帧播放的间隔
        spriteAnima.setDelayPerUnit(0.1);

        //是否回到第一帧播放
        spriteAnima.setRestoreOriginalFrame(false);

        var animate = new cc.Animate(spriteAnima);

        var seq = cc.sequence(
        animate,
        cc.callFunc(this.removeFromParent, sprite)
        );

        //播放动画
        sprite.runAction(seq);
    },

    //初始化游戏中用到的一些数据
    initData:function()
    {
        //宝象国场景的过关目标分
        vecScore = [410, 690, 810, 835, 840, 910, 1090, 1270, 1300, 1410, 1410, 1820];

        animationIndex = -1;

        //设置游戏时间为60秒
        numTime = 60;

        //初始化时,不能触摸屏幕
        isTouch = false;

        //处于测试状态下为true，正式时为false
        //初始化时,不能点击返回按钮
        isClick = false;

        //初始化绳子的描点
        anchorX = 0.5;
        anchorY = 0.05;

        minX = 790;
        minY = 470;

        time = 0;

        //绳子初始化时的角度为70度
        shengziAngle = 70;

        //绳子初始化的时候向右摇摆
        isDirection = true;

        //设置游戏得分为0
        numScore = 0;

        //设置过关目标分
        airmScore = vecScore[indexLevel - 1];

        //初始化时,显示第0页的数据
        indexPage = 0;

        repShengzi = null;

        //初始化时,钩子上没有抓矿石
        isGouzi = false;

        spriteFrameCache = cc.spriteFrameCache;
        spriteFrameCache.addSpriteFrames(res.tangseng_plist, res.tangseng_png);
    },

    //添加地图
    addMap:function()
    {
        //创建地图
        map = new cc.TMXTiledMap("res/tmx/baoxiangguo" + indexLevel + ".tmx");
        this.addChild(map);
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

            //将矿石添加到矿石数组中
            vecMineral.push(mineral);
        }
    },

    //添加按钮
    addButton:function()
    {
        //添加暂停按钮
        var buttonPause = new ccui.Button();
        buttonPause.setTouchEnabled(true);
        buttonPause.loadTextures(res.zanting1_png, res.zanting2_png, "");
        buttonPause.x = width - 100;
        buttonPause.y = height - 100;
        moveNode(buttonPause, cc.p(50, 50));
        buttonPause.addTouchEventListener(this.openPauseDialog, this);
        this.addChild(buttonPause);
    },

    //打开暂停对话框
    openPauseDialog: function (sender, type)
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
    },

    //加载CocosStudio创建好的资源
    loadCocosStudio:function()
    {
        //时间对话框
        timeDialog = ccs.load(res.progressTime_json);
        timeDialog.node.anchorX = 0.5;
        timeDialog.node.anchorY = 0.5;
        timeDialog.node.x = 70;
        timeDialog.node.y = height - 60;
        moveNode(timeDialog.node, cc.p(-30, 18));
        this.addChild(timeDialog.node);

        //添加一个黑色的半透明背景
        layerColor = new cc.LayerColor(cc.color(0, 0, 0, 200), width, height);
        layerColor.visible = false;
        layerColor.setLocalZOrder(10);
        this.addChild(layerColor);

        //暂停对话框
        pauseDialog = ccs.load(res.pauseDialog_json);
        pauseDialog.node.anchorX = 0.5;
        pauseDialog.node.anchorY = 0.5;
        pauseDialog.node.x = width / 2;
        pauseDialog.node.y = height / 2;
        pauseDialog.node.setLocalZOrder(10);
        pauseDialog.node.visible = false;
        this.addChild(pauseDialog.node);

        //帮助对话框
        helpDialog = ccs.load(res.HelpDialog_json);
        helpDialog.node.anchorX = 0.5;
        helpDialog.node.anchorY = 0.5;
        helpDialog.node.x = 60;
        helpDialog.node.y = 450;
        helpDialog.node.setLocalZOrder(10);
        helpDialog.node.visible = false;
        this.addChild(helpDialog.node);

        //游戏失败时弹出的对话框
        failGameDialog = ccs.load(res.failGameDialog_json);
        failGameDialog.node.anchorX = 0.5;
        failGameDialog.node.anchorY = 0.5;
        failGameDialog.node.x = width / 2;
        failGameDialog.node.y = height / 2 + 20;
        failGameDialog.node.setLocalZOrder(10);
        failGameDialog.node.scale = 0;
        failGameDialog.node.opacity = 0;
        this.addChild(failGameDialog.node);

        //创建游戏成功时弹出的对话框
        successGameDialog = ccs.load(res.successGameDialog_json);
        successGameDialog.node.anchorX = 0.5;
        successGameDialog.node.anchorY = 0.5;
        successGameDialog.node.x = width / 2;
        successGameDialog.node.y = height / 2 + 20;
        successGameDialog.node.setLocalZOrder(10);
        successGameDialog.node.scale = 0;
        successGameDialog.node.opacity = 0;
        this.addChild(successGameDialog.node);
    },

    //获得节点的信息
    getNodeInfo:function()
    {
        labelTime = timeDialog.node.getChildByName("labelTime");
        progressScore = timeDialog.node.getChildByName("progressScore");
        labelLevel = timeDialog.node.getChildByName("labelLevel");
        labelScore = timeDialog.node.getChildByName("labelScore");

        //继续游戏按钮
        var buttonContinue = pauseDialog.node.getChildByName("buttonContinue");
        buttonContinue.addTouchEventListener(this.continueGame);

        //重玩按钮
        var buttonReplay = pauseDialog.node.getChildByName("buttonReplay");
        buttonReplay.addTouchEventListener(this.replayGame);

        //菜单按钮
        var buttonMenu = pauseDialog.node.getChildByName("buttonMenu");
        buttonMenu.addTouchEventListener(this.intoSceneMenu);

        //打开帮助对话框按钮
        var buttonHelp = pauseDialog.node.getChildByName("buttonHelp");
        buttonHelp.addTouchEventListener(this.openHelpDialog.bind(this));

        //获得关闭帮助对话框按钮
        var buttonCloseHelpDialog = helpDialog.node.getChildByName("closeHelpDialog");
        buttonCloseHelpDialog.addTouchEventListener(this.closeHelpDialog);

        //获得向左翻页按钮
        buttonPageLeft = helpDialog.node.getChildByName("pageLeft");
        buttonPageLeft.addTouchEventListener(this.pageLeft.bind(this));

        //获得向右翻页按钮
        buttonPageRight = helpDialog.node.getChildByName("pageRight");
        buttonPageRight.addTouchEventListener(this.pageRight.bind(this));

        spriteInfo = helpDialog.node.getChildByName("spriteInfo");

        //重玩按钮(游戏失败对话框中的重玩按钮)
        var buttonReplay1 = failGameDialog.node.getChildByName("buttonReplay");
        buttonReplay1.addTouchEventListener(this.replayGame);

        //菜单按钮(游戏失败对话框中的菜单按钮)
        var buttonMenu1 = failGameDialog.node.getChildByName("buttonMenu");
        buttonMenu1.addTouchEventListener(this.intoSceneMenu);

        //菜单按钮(游戏成功对话框中的菜单按钮)
        var buttonMenu2 = successGameDialog.node.getChildByName("buttonMenu");
        buttonMenu2.addTouchEventListener(this.intoSceneMenu);

        //重新开始按钮(游戏成功对话框中的重新开始按钮)
        var buttonStart = successGameDialog.node.getChildByName("buttonStart");
        buttonStart.addTouchEventListener(this.replayGame);

        //进入下一关按钮(游戏成功对话框中的进入下一关按钮)
        var buttonLevel = successGameDialog.node.getChildByName("buttonLevel");
        buttonLevel.addTouchEventListener(this.intoNextLevel);
    },

    //继续游戏
    continueGame:function(sender, type)
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

                //标记不能再点击暂停按钮
                isClick = true;

                //标记不能触摸屏幕
                isTouch = true;

                layerColor.visible = false;
                pauseDialog.node.visible = false;
                cc.director.resume();
            }
            break;
            default:
            break;
        }
    },

    //重玩游戏
    replayGame:function(sender, type)
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

                cc.audioEngine.stopMusic(res.sound002_mp3);

                cc.director.resume();
                cc.director.runScene(new SceneBaoXiangGuo());
            }
            break;
            default:
            break;
        }
    },

    //进入菜单场景
    intoSceneMenu:function(sender, type)
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
    },

    //打开帮助对话框
    openHelpDialog:function(sender, type)
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

                pauseDialog.node.visible = false;
                helpDialog.node.visible = true;

                //展示第0页的帮助信息
                indexPage = 0;

                //刷新页面上的数据
                this.updatePageData();
            }
            break;
            default:
            break;
        }
    },

    //关闭帮助对话框
    closeHelpDialog:function(sender, type)
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
    },

    //向左翻页
    pageLeft: function(sender, type)
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

                //页码减1
                indexPage--;

                //刷新页面上的数据
                this.updatePageData();
            }
            break;
            default:
            break;
        }
    },

    //向右翻页
    pageRight:function(sender, type)
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

                //页码加1
                indexPage++;

                //刷新页面上的数据
                this.updatePageData();
            }
            break;
            default:
            break;
        }
    },

    //进入下一关
    intoNextLevel : function(sender, type)
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

                if (ndexLevel > 12)
                {
                    indexLevel = 1;
                }

                cc.director.runScene(new SceneBaoXiangGuo());
            }
            break;
            default:
            break;
        }
    },

    //翻页时,刷新页面上的数据
    updatePageData:function()
    {
        //如果翻到了第0页
        if (indexPage == 0)
        {
            //隐藏向左翻页的翻页按钮
            buttonPageLeft.visible = false;

            //显示向右翻页的翻页按钮
            buttonPageRight.visible = true;
        }

        //如果翻到了第7页
        if (indexPage == 7)
        {
            //显示向左翻页的翻页按钮
            buttonPageLeft.visible = true;

            //隐藏向右翻页的翻页按钮
            buttonPageRight.visible = false;
        }

        //如果在1到6页之间
        if (indexPage >= 1 && indexPage <= 6)
        {
            //显示向左翻页的翻页按钮
            buttonPageLeft.visible = true;

            //显示向右翻页的翻页按钮
            buttonPageRight.visible = true;
        }

        //显示该页上的内容
        spriteInfo.setTexture("res/help" + indexPage + ".png");

        for (var i = 0; i <= 7; i++)
        {
            var sprite = seekFromRootByName(helpDialog.node, "dian" + i);

            if (i == indexPage)
            {
                sprite.setTexture(res.pinkPoint_png);
            }
            else
            {
                sprite.setTexture(res.brownPoint_png);
            }
        }
    },

    //设置一些数据
    setData:function()
    {
        //加载图片到精灵帧缓存池
        //frameCache = SpriteFrameCache::getInstance();
        //frameCache->addSpriteFramesWithFile("SceneGame/tangseng.plist", "SceneGame/tangseng.png");

        //设置游戏时间
        labelTime.setString(numTime);

        //设置游戏的得分进度
        progressScore.setPercent(0);

        //设置游戏的关卡信息
        labelLevel.setString(indexSceneGame + " - " + indexLevel);

        //设置游戏的分值
        labelScore.setString(numScore + " / " + airmScore);
    },

    //添加游戏角色
    addPlayer:function()
    {
        player = new cc.Sprite(spriteFrameCache.getSpriteFrame("tsfang01.png"));
        player.x = width / 2;
        player.y = height / 2;
        moveNode(player, cc.p(40, 170));
        this.addChild(player);
    },

    //添加滚轮
    addGunLun:function()
    {
        var gunlun = new cc.Sprite(res.gunlun_png);
        gunlun.x = width / 2;
        gunlun.y = height / 2
        moveNode(gunlun, cc.p(0, 130));
        this.addChild(gunlun);
    },

    //创建裁剪结点
    createClipNode:function()
    {
        //裁剪精灵,用于创建裁剪模板
        var masking = new cc.Sprite(res.masking_png);
        masking.anchorX = 0.5;
        masking.anchorY = 0;
        masking.x = width / 2;
        masking.y = height - 100;
        moveNode(masking, cc.p(0, -18));

        //创建裁剪结点
        clipNode = new cc.ClippingNode();
        clipNode.setStencil(masking);
        clipNode.setInverted(true);
        clipNode.setAlphaThreshold(0.5);
        clipNode.anchorX = 0;
        clipNode.anchorY =0;
        clipNode.x = 0;
        clipNode.y = 0;
        this.addChild(clipNode);
    },

    //添加绳子
    addShengZi:function()
    {
        //创建绳子
        shengzi = new cc.Sprite(res.shengzi_png);
        shengzi.anchorX = anchorX;
        shengzi.anchorY = anchorY;
        shengzi.x = width / 2;
        shengzi.y = height / 2;
        moveNode(shengzi, cc.p(-5, 120));
        shengzi.rotation = shengziAngle;

        //将绳子添加到裁剪结点上
        clipNode.addChild(shengzi);

        //添加钩子
        gouzi = new cc.Sprite(res.gouzi_png);
        gouzi.anchorX = 0.5;
        gouzi.anchorY = 1;
        moveNode(gouzi, cc.p(3, 0));
        shengzi.addChild(gouzi);

        //获得绳子的长度
        shengziLength = shengzi.getContentSize().height;
    },

    //添加触摸
    addTouch:function()
    {
        //创建触摸事件监听器
        this.touchListener = cc.EventListener.create(
        {
            // 监听单点触摸
            event: cc.EventListener.TOUCH_ONE_BY_ONE,

            // 设置吃掉事件
            swallowTouches: true,

            // 开始触摸
            onTouchBegan: function (touch, event)
            {
                if (!isTouch)
                {
                    return false;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound015_mp3);
                }

                //标记不能再触摸了
                isTouch = false;

                //绳子停止左右摇摆
                this.unschedule(this.playShengZiAction);

                //创建定时器,用于升长绳子
                this.schedule(this.longRope, 0.05);

                return true;
            }.bind(this)
        });

        // 注册监听器到事件管理器
        cc.eventManager.addListener(this.touchListener,this);
    },

    //升长绳子
    longRope:function()
    {
        anchorY += 0.01;
        shengzi.anchorX = anchorX;
        shengzi.anchorY = anchorY;
    },

    //播放绳子左右摇摆的动作
    playShengZiAction:function()
    {
        //当绳子转到最左端时
        if (shengziAngle == 70)
        {
            //标记绳子向右摇摆
            isDirection = true;
        }

        //当绳子转到最右端时
        if (shengziAngle == -70)
        {
            //标记绳子向左摇摆
            isDirection = false;
        }

        //绳子向右摇摆
        if (isDirection)
        {
            shengziAngle--;
            shengzi.rotation = shengziAngle;
        }
        //绳子向左摇摆
        else
        {
            shengziAngle++;
            shengzi.rotation = shengziAngle;
        }
    }
});

var SceneBaoXiangGuo = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new BaoXiangGuoLayer();
        this.addChild(layer);
    }
});


