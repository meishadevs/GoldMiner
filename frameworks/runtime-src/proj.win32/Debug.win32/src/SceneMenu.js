/**
 * 菜单场景(关卡选择场景)
 */
var MenuLayer = cc.Layer.extend(
{
    rootNode:null,

    //用于设置游戏场景的名称
    spriteTitle:null,

    //用于设置游戏场景所在的图片
    spriteImage:null,

    ctor:function ()
    {
        this._super();

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

        this.initCocosStudio();

        this.getButton();

        this.initMenuPage();

        return true;
    },

    initCocosStudio:function()
    {
        //设置菜单
        rootNode = ccs.load(res.SceneMenu_json);
        this.addChild(rootNode.node);
    },

    getButton:function()
    {
        //获得返回按钮
        var buttonReturn = ccui.helper.seekWidgetByName(rootNode.node, "buttonReturn");
        buttonReturn.addTouchEventListener(this.intoSceneStart);

        //获得进入游戏场景按钮
        var buttonGame = ccui.helper.seekWidgetByName(rootNode.node, "intoGame");
        buttonGame.addTouchEventListener(this.intoSceneGame);

        //获得向左翻页按钮
        var buttonPageLeft = ccui.helper.seekWidgetByName(rootNode.node, "buttonPageLeft");
        buttonPageLeft.addTouchEventListener(this.pageLeft.bind(this));

        //获得向右翻页按钮
        var buttonPageRight = ccui.helper.seekWidgetByName(rootNode.node, "buttonPageRight");
        buttonPageRight.addTouchEventListener(this.pageRight.bind(this));

        spriteTitle = rootNode.node.getChildByName("spriteTitle");
        spriteImage = rootNode.node.getChildByName("spriteImage");
    },

    //进入开始场景
    intoSceneStart: function (sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                //停止播放背景音乐
                cc.audioEngine.stopMusic(res.sound001_mp3);
                cc.director.runScene(new SceneStart());
            }
            break;
            default :
            break;
        }
    },

    //进入游戏场景
    intoSceneGame: function (sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                //停止播放背景音乐
                cc.audioEngine.stopMusic(res.sound001_mp3);

                //进入宝象国
                if (indexSceneGame == 1)
                {
                    cc.director.runScene(new SceneBaoXiangGuo());
                }
                //进入通天河
                else if (indexSceneGame == 2)
                {
                    cc.director.runScene(new SceneTongTianHe());
                }
                //进入女儿国
                else if (indexSceneGame == 3)
                {
                    cc.director.runScene(new SceneNvErGuo());
                }
                //进入火焰山
                else if (indexSceneGame == 4)
                {
                    cc.director.runScene(new SceneHuoYanShan());
                }
                //进入灵山
                else if (indexSceneGame == 5)
                {
                    cc.director.runScene(new SceneLingShan());
                }
            }
            break;
            default :
            break;
        }
    },

    //初始化菜单页面
    initMenuPage:function()
    {
        //刷新页面
        this.updatePageData();
    },

    //刷新页面
    updatePageData: function ()
    {
        //设置游戏场景的标题
        spriteTitle.setTexture(arrayTitle[indexSceneGame]);

        //设置游戏场景的图片
        var index = indexSceneGame - 1;
        spriteImage.setTexture("res/SceneMenu/tu" + index + ".png");

        for (var i = 0; i <= 4; i++)
        {
            sprite = seekFromRootByName(rootNode.node, "dian" + i);

            if (i == indexSceneGame - 1)
            {
                sprite.setTexture(res.yellowPoint_png);
            }
            else
            {
                sprite.setTexture(res.blackPoint_png);
            }
        }
    },

    //向左翻页
    pageLeft: function (sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                //向左翻一页
                indexSceneGame--;

                if (indexSceneGame == 0)
                {
                    indexSceneGame = 5;
                }

                //刷新页面
                this.updatePageData();
            }
            break;
            default :
            break;
        }
    },

    //向右翻页
    pageRight : function (sender, type)
    {
        switch (type)
        {
            case ccui.Widget.TOUCH_BEGAN:
            {
                if (effVolume)
                {
                    //播放按钮音效
                    cc.audioEngine.playEffect(res.sound010_mp3);
                }

                //向右翻一页
                indexSceneGame++;

                if (indexSceneGame == 6)
                {
                    indexSceneGame = 1;
                }

                //刷新页面
                this.updatePageData();
            }
            break;
            default :
            break;
        }
    },
});


var SceneMenu = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new MenuLayer();
        this.addChild(layer);
    }
});

