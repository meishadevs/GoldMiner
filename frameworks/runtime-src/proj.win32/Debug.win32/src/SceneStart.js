/**
 * 开始场景
 */
var StartLayer = cc.Layer.extend(
{
    settingMenu : null,
    settingDialog : null,
    helpDialog : null,
    buttonOpenMenu : null,
    buttonCloseMenu : null,
    layerColor : null,
    buttonPlayBgVolume : null,
    buttonStopBgVolume : null,
    buttonPlayEffVolume : null,
    buttonStopEffVolume : null,
    buttonSetting : null,

    //标记是否能点击按钮
    isClieck : null,

    ctor:function ()
    {
        this._super();

        //初始化时能点击按钮
        isClieck = true;

        //初始化时帮助菜单中展示第0页的信息
        indexPage = 0;

        if (bgVolume)
        {
            //播放背景音乐
            cc.audioEngine.playMusic(res.sound001_mp3, true);
        }
        else
        {
            //停止播放背景音乐
            cc.audioEngine.stopMusic(res.sound001_mp3);
        }

        //添加游戏背景
        this.addBackground();

        //添加云朵
        this.addCloud();

        //添加孙悟空
        this.addSunwukong();

        //添加栅栏
        this.addZhalan();

        //添加小龙女
        this.addXiaolongnv();

        //添加沙僧
        this.addShaseng();

        //添加猪八戒
        this.addZhubajie();

        //添加唐僧
        this.addTangseng();

        //添加游戏logo
        this.addLogo();

        //添加钻石
        this.addZuanshi();

        //添加按钮
        this.addButton();

        //初始化使用CocosStudiof创建好的文件
        this.initCocosStudio();

        this.getButton();
    },

    //添加游戏背景
    addBackground:function()
    {
        var bg = new cc.Sprite(res.beijing_png);
        bg.anchorX = 0.5;
        bg.anchorY = 0.5;
        bg.x = width / 2;
        bg.y = height / 2;
        this.addChild(bg);
    },

    //添加游戏的logo
    addLogo:function()
    {
        var logo = new cc.Sprite(res.logo_png);
        logo.anchorX = 0.5;
        logo.anchorY = 0.5;
        logo.x = width / 2;
        logo.y = height / 2;
        moveNode(logo, cc.p(0, 155));
        this.addChild(logo);
    },

    //添加云朵
    addCloud:function()
    {
        var cloud = new cc.Sprite(res.yun_png);
        cloud.anchorX = 0.5;
        cloud.anchorY = 0.5;
        cloud.x = width / 2;
        cloud.y = height / 2;
        moveNode(cloud, cc.p(0, -220));
        this.addChild(cloud);
    },

    //添加孙悟空
    addSunwukong:function()
    {
        var sunwukong = new cc.Sprite(res.sunwukong_png);
        sunwukong.anchorX = 0.5;
        sunwukong.anchorY = 0.5;
        sunwukong.x = width / 2;
        sunwukong.y = height / 2;
        moveNode(sunwukong, cc.p(-170, -40));
        this.addChild(sunwukong);

        var move1 = new cc.MoveBy(1, cc.p(0, -10));
        var move2 = new cc.MoveBy(1, cc.p(0, 10));
        var seq = cc.sequence(move1, move2);
        var rf = cc.repeatForever(seq);
        sunwukong.runAction(rf);
    },

    //添加栅栏
    addZhalan:function()
    {
        var zhalan = new cc.Sprite(res.zhalan_png);
        zhalan.anchorX = 0.5;
        zhalan.anchorY = 0.5;
        zhalan.x = width / 2;
        zhalan.y = height / 2;
        moveNode(zhalan, cc.p(-170, -150));
        this.addChild(zhalan);
    },

    //添加小龙女
    addXiaolongnv:function()
    {
        var xiaolongnv = new cc.Sprite();
        this.addChild(xiaolongnv);
        moveNode(xiaolongnv, cc.p(370, 200));

        //利用动画保存每一帧的图片
        var spriteAnima = new cc.Animation();

        for(var i = 1; i <=  6; i++)
        {
            var str = "res/SceneStart/xiaolongnv" + i + ".png";

            spriteAnima.addSpriteFrameWithFile(str);
        }

        //每一帧播放的间隔
        spriteAnima.setDelayPerUnit(0.1);

        //是否回到第一帧播放
        spriteAnima.setRestoreOriginalFrame(false);

        var annimate = new cc.Animate(spriteAnima);

        var seq = cc.sequence(annimate,
        //将反向播放ani动画
        annimate.reverse());

        //播放动画
        xiaolongnv.runAction(cc.repeatForever(seq));
    },

    //添加沙僧
    addShaseng:function()
    {
        var shaseng = new cc.Sprite("res/SceneStart/shaseng.png");
        shaseng.anchorX = 0.5;
        shaseng.anchorY = 0.5;
        moveNode(shaseng, cc.p(640, 140));
        this.addChild(shaseng);
    },

    //添加唐僧
    addTangseng:function()
    {
        var tangseng = new cc.Sprite();
        this.addChild(tangseng);
        moveNode(tangseng, cc.p(400, 170));


        //利用动画保存每一帧的图片
        var spriteAnima = new cc.Animation();

        for(var i = 1; i <=  6; i++)
        {
            var str = "res/SceneStart/tangseng" + i + ".png";

            spriteAnima.addSpriteFrameWithFile(str);
        }

        //每一帧播放的间隔
        spriteAnima.setDelayPerUnit(0.1);

        //是否回到第一帧播放
        spriteAnima.setRestoreOriginalFrame(false);

        var annimate = new cc.Animate(spriteAnima);

        var seq = cc.sequence(annimate,
            //将反向播放ani动画
            annimate.reverse());

        //播放动画
        tangseng.runAction(cc.repeatForever(seq));
    },

    //添加猪八戒
    addZhubajie:function()
    {
        var zhubajie = new cc.Sprite(res.zhubajie_png);
        zhubajie.anchorX = 0.5;
        zhubajie.anchorY = 0.5;
        moveNode(zhubajie, cc.p(600, 150));
        this.addChild(zhubajie);
    },

    //添加钻石
    addZuanshi:function()
    {
        var zuanshi = new cc.Sprite(res.zuanshi_png);
        zuanshi.anchorX = 0.5;
        zuanshi.anchorY = 0.5;
        zuanshi.x = width / 2;
        zuanshi.y = height / 2;
        moveNode(zuanshi, cc.p(-220, -110));
        this.addChild(zuanshi);

        var move1 = new cc.MoveBy(1, cc.p(0, -10));
        var move2 = new cc.MoveBy(1, cc.p(0, 10));
        var seq = cc.sequence(move1, move2);
        zuanshi.runAction(cc.repeatForever(seq));
    },

    //添加按钮
    addButton:function()
    {
        var buttonStart = new ccui.Button();
        buttonStart.setTouchEnabled(true);
        buttonStart.loadTextures(res.kaishi1_png, res.kaishi2_png, "");
        buttonStart.x = width / 2;
        buttonStart.y = 60;
        buttonStart.addTouchEventListener(this.intoSceneMenu, this);
        this.addChild(buttonStart);
    },

    //进入菜单场景
    intoSceneMenu : function (sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                //停止播放背景音乐
                cc.audioEngine.stopMusic(res.sound001_mp3);
                cc.director.runScene(new SceneMenu());
            }
            break;
            default :
            break;
        }
    },

    //初始化使用CocosStudio创建好的文件
    initCocosStudio:function()
    {
        //设置菜单
        settingMenu = ccs.load(res.SettingMenu_json);
        settingMenu.node.anchorX = 0;
        settingMenu.node.anchorY = 0;
        settingMenu.node.x = width - 55;
        settingMenu.node.y = 30;
        this.addChild(settingMenu.node);

        //添加一个黑色的半透明背景
        layerColor = new cc.LayerColor(cc.color(0, 0, 0, 200), width, height);
        layerColor.visible = false;
        this.addChild(layerColor);

        //设置对话框
        settingDialog = ccs.load(res.settingDialog_json);
        settingDialog.node.anchorX = 0.5;
        settingDialog.node.anchorY = 0.5;
        settingDialog.node.x = width / 2;
        settingDialog.node.y = height / 2;
        settingDialog.node.scale = 0;
        this.addChild(settingDialog.node);

        //帮助对话框
        helpDialog = ccs.load(res.HelpDialog_json);
        helpDialog.node.anchorX = 0.5;
        helpDialog.node.anchorY = 0.5;
        helpDialog.node.x = 60;
        helpDialog.node.y = 450;
        helpDialog.node.scale = 0;
        this.addChild(helpDialog.node);
    },

    getButton:function()
    {
        //获得打开设置菜单按钮
        buttonOpenMenu = ccui.helper.seekWidgetByName(settingMenu.node, "buttonOpenMenu");
        buttonOpenMenu.addTouchEventListener(this.openSettingMenu);

        //获得关闭设置菜单按钮
        buttonCloseMenu = ccui.helper.seekWidgetByName(settingMenu.node, "buttonCloseMenu");
        buttonCloseMenu.addTouchEventListener(this.closeSettingMenu);

        //获得打开设置对话框按钮
        buttonSetting = ccui.helper.seekWidgetByName(settingMenu.node, "buttonSetting");
        buttonSetting.addTouchEventListener(this.openSettingDialog);

        //获得关闭设置对话框按钮
        var buttonCloseSettingDialog = ccui.helper.seekWidgetByName(settingDialog.node, "buttonCloseSettingDialog");
        buttonCloseSettingDialog.addTouchEventListener(this.closeSettingDialog);

        //获得打开帮助对话框按钮
        var buttonHelp = ccui.helper.seekWidgetByName(settingMenu.node, "buttonHelp");
        buttonHelp.addTouchEventListener(this.openHelpDialog.bind(this));

        //获得关闭帮助对话框按钮
        var buttonCloseHelpDialog = ccui.helper.seekWidgetByName(helpDialog.node, "closeHelpDialog");
        buttonCloseHelpDialog.addTouchEventListener(this.closeHelpDialog);

        //获得播放背景音乐按钮
        buttonPlayBgVolume = ccui.helper.seekWidgetByName(settingDialog.node, "playBgVolume");
        buttonPlayBgVolume.addTouchEventListener(this.stopBgVolume);

        //获得停止播放背景音乐按钮
        buttonStopBgVolume = ccui.helper.seekWidgetByName(settingDialog.node, "stopBgVolume");
        buttonStopBgVolume.addTouchEventListener(this.playBgVolume);

        //获得播放游戏音效按钮
        buttonPlayEffVolume = ccui.helper.seekWidgetByName(settingDialog.node, "playEffVolume");
        buttonPlayEffVolume.addTouchEventListener(this.stopEffVolume);

        //获得停止播放游戏音效的按钮
        buttonStopEffVolume = ccui.helper.seekWidgetByName(settingDialog.node, "stopEffVolume");
        buttonStopEffVolume.addTouchEventListener(this.playEffVolume);

        //获得向左翻页按钮
        buttonPageLeft = ccui.helper.seekWidgetByName(helpDialog.node, "pageLeft");
        buttonPageLeft.addTouchEventListener(pageLeft);

        //获得向右翻页按钮
        buttonPageRight = ccui.helper.seekWidgetByName(helpDialog.node, "pageRight");
        buttonPageRight.addTouchEventListener(pageRight);

        spriteInfo = ccui.helper.seekWidgetByName(helpDialog.node, "spriteInfo");

         //获得更多游戏按钮
         var buttonMoreGame = ccui.helper.seekWidgetByName(settingMenu.node, "buttonMoreGame");
         buttonMoreGame.addTouchEventListener(this.moreGame);

         //获得退出游戏按钮
         var buttonExitGame = ccui.helper.seekWidgetByName(settingMenu.node, "buttonExitGame");
         buttonExitGame.addTouchEventListener(this.exitGame);
    },

    //更多游戏
    moreGame:function(sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                window.location.href = "http://www.52h5game.com/"
            }
            break;
            default:
            break;
        }
    },

    //退出游戏
    exitGame:function(sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                alert("其实没有退出啦=_=|||\n"
                      + "因为实在是没有其他键要实现(囧rz)\n"
                      + "就拿退出键滥竽充数。~~~(>_<)~~~");
            }
            break;
            default:
            break;
        }
    },

    //打开设置菜单
    openSettingMenu:function(sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                buttonOpenMenu.visible = false;
                buttonCloseMenu.visible = true;
                var move = new cc.MoveBy(0.2, cc.p(-230, 0));
                settingMenu.node.runAction(move);
            }
            break;
            default:
            break;
        }
    },

    //关闭设置菜单
    closeSettingMenu:function(sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                buttonOpenMenu.visible = true;
                buttonCloseMenu.visible = false;
                var move = new cc.MoveBy(0.2, cc.p(230, 0));
                settingMenu.node.runAction(move);
            }
            break;
            default:
            break;
        }
    },

    //打开设置对话框
    openSettingDialog:function(sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_ENDED:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                layerColor.visible = true;
                isClieck = false;

                var scale = new cc.ScaleTo(0.3, 1);
                settingDialog.node.runAction(scale);

                //如果在播放背景音乐
                if (bgVolume)
                {
                    //显示播放背景音乐按钮
                    buttonPlayBgVolume.visible = true;

                    //隐藏停止播放背景音乐按钮
                    buttonStopBgVolume.visible = false;
                }
                //如果不播放背景音乐
                else
                {
                    //显示停止播放背景音乐按钮
                    buttonStopBgVolume.visible = true;

                    //隐藏播放背景音乐按钮
                    buttonPlayBgVolume.visible = false;
                }

                //如果在播放游戏音效
                if (effVolume)
                {
                    //显示播放游戏音效按钮
                    buttonPlayEffVolume.visible = true;

                    //隐藏停止播放游戏音效按钮
                    buttonStopEffVolume.visible = false;
                }
                //如果不播放游戏音效
                else
                {
                    //显示停止播放游戏音效按钮
                    buttonStopEffVolume.visible = true;

                    //隐藏播放游戏音效按钮
                    buttonPlayEffVolume.visible = false;
                }
            }
            break;
            default:
            break;
        }
    },

    //关闭设置对话框
    closeSettingDialog:function(sender, type)
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

                layerColor.visible = false;
                isClieck = true;

                var scale = new cc.ScaleTo(0.3, 0);
                settingDialog.node.runAction(scale);
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
            case ccui.Widget.TOUCH_ENDED:
            {
                if (!isClieck)
                {
                    return;
                }

                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                layerColor.visible = true;

                isClieck = false;

                var scale = new cc.ScaleTo(0.3, 1);
                helpDialog.node.runAction(scale);

                //初始化帮助对话框
                this.initHelpDialog();
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

                layerColor.visible = false;
                isClieck = true;
                var scale = new cc.ScaleTo(0.3, 0);
                helpDialog.node.runAction(scale);
            }
            break;
            default:
            break;
        }
    },

    //初始化帮助菜单中的信息
    initHelpDialog:function()
    {
         //展示第0页的帮助信息
         indexPage = 0;

         //刷新页面上的数据
         updatePageData();
    },

    //播放背景音乐
    playBgVolume:function(sender, type)
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

                //显示播放背景音乐按钮
                buttonPlayBgVolume.visible = true;

                //隐藏停止播放背景音乐按钮
                buttonStopBgVolume.visible = false;

                //播放背景音乐
                cc.audioEngine.playMusic(res.sound001_mp3, true);

                //标记播放背景音乐
                bgVolume = true;
            }
            break;
            default:
            break;
        }
    },


    //停止播放背景音乐
    stopBgVolume: function(sender, type)
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

                //显示停止播放背景音乐按钮
                buttonStopBgVolume.visible = true;

                //隐藏播放背景音乐按钮
                buttonPlayBgVolume.visible = false;

                //停止播放背景音乐
                cc.audioEngine.stopMusic(res.sound001_mp3);

                //标记停止播放背景音乐
                bgVolume = false;
            }
            break;
            default:
            break;
        }
    },

    //播放游戏音效
    playEffVolume:function(sender, type)
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

                //显示播放游戏音效按钮
                buttonPlayEffVolume.visible = true;

                //隐藏停止播放游戏音效按钮
                buttonStopEffVolume.visible = false;

                //标记播放游戏音效
                effVolume = true;
            }
            break;
            default:
            break;
        }
    },

    //停止播放游戏音效
    stopEffVolume:function(sender, type)
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

                //显示停止播放游戏音效按钮
                buttonStopEffVolume.visible = true;

                //隐藏播放游戏音效按钮
                buttonPlayEffVolume.visible = false;

                //标记停止播放游戏音效
                effVolume = false;
            }
            break;
            default:
            break;
        }
    }
});

var SceneStart = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new StartLayer();
        this.addChild(layer);
    }
});