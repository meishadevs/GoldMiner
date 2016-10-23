/**
 * 存放与游戏逻辑相关的代码
 */

//添加触摸
var addTouch = function(self)
{
    self.touchListener = cc.EventListener.create(
    {
        event: cc.EventListener.TOUCH_ONE_BY_ONE,
        swallowTouches: true,

        onTouchBegan: function (touch, event)
        {
            if (!isTouch)
            {
                return false;
            }

            if (effVolume)
            {
                cc.audioEngine.playEffect(res.sound015_mp3);
            }

            isTouch = false;
            self.unschedule(playShengZiAction);
            self.schedule(longRope, 0.05);

            return true;
        }.bind(self)
    });

    cc.eventManager.addListener(self.touchListener, self);
}

//计算绳子最低点的坐标
var sumShengZiMinPoint = function()
{
    //计算绳子升了多长
    var length = shengziLength * anchorY + 30;

    //将绳子的角度转换成弧度
    var radians = cc.degreesToRadians(shengzi.getRotation());

    //计算绳子上的最低点的x坐标
    minX = shengzi.x - length * Math.sin(radians);

    //计算绳子的最低点的y坐标
    minY = shengzi.y - length * Math.cos(radians);
}

//判断绳子是否升到了窗口外面
var isOutofWindows = function(self)
{
    //如果绳子升到了窗口外面
    if (minX <= 0 || minX >= width || minY <= 0 || minY >= height)
    {
        time++;

        //保证isOutofWindows只调用一次
        if (time != 1)
        {
            return;
        }

        //绳子停止升长
        self.unschedule(longRope);

        //缩短绳子
        self.schedule(self.shortenRope, 0.05);

        //播放游戏角色拉绳子的动画
        self.createPlayerAnimation();
    }
}

//翻页时,刷新页面上的数据
var updatePageData = function()
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
}

//碰撞检测
var collisionItem = function(self)
{
    //遍历保存在数组中的矿石
    for (var i = 0; i < vecMineral.length; i++)
    {
        var ptNode = map.convertToNodeSpace(cc.p(minX, minY));

        //获得矿石的属性
        var mineral = vecMineral[i];

        if (cc.rectContainsPoint(mineral.getBoundingBox(), ptNode))
        {
            //如果钩子上抓了矿石
            if (isGouzi)
            {
                return;
            }

            //标记钩子上抓了矿石
            isGouzi = true;

            //绳子停止升长
            self.unschedule(longRope);

            //移除地图上的矿石
            var type = mineral.type;
            vecMineral[i].removeFromParent();
            vecMineral[i] = undefined;
            vecMineral.splice(i,1);

            //如果抓到的是炸药
            if (type == 1)
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound_bomb_mp3);
                }

                //播放炸弹爆炸动画
                Boom(self);
            }
            //抓到的不是炸药
            else
            {
                if (effVolume)
                {
                    cc.audioEngine.playEffect(res.sound007_mp3);
                }
                //创建一个矿石,并且将矿石挂在钩子上
                var tempMineral = new cc.Sprite("res/tmx/goods_" + type + ".png");

                tempMineral.anchorX = 0.5;
                tempMineral.anchorY = 1;
                moveNode(tempMineral, cc.p(20, 15));
                tempMineral.setTag(1);
                tempMineral.type = type;
                tempMineral.setLocalZOrder(-1);
                gouzi.addChild(tempMineral);

                //播放抓住矿石时的动画
                playGrabAnimation(self);


                //绳子缩短
                self.schedule(self.shortenRope, 0.05);
                if (repShengzi == null)
                {
                    self.createPlayerAnimation();
                }
            }
        }
    }
}

//升长绳子
longRope = function()
{
    anchorY += 0.01;
    shengzi.anchorX = anchorX;
    shengzi.anchorY = anchorY;
}

//播放绳子左右摇摆的动作
playShengZiAction = function()
{
    //当绳子转到最左端时
    if (shengziAngle >= 70)
    {
        //标记绳子向右摇摆
        isDirection = true;
    }

    //当绳子转到最右端时
    if (shengziAngle <= -70)
    {
        //标记绳子向左摇摆
        isDirection = false;
    }

    //绳子向右摇摆
    if (isDirection)
    {
        shengziAngle -= 2;
        shengzi.rotation = shengziAngle;
    }
    //绳子向左摇摆
    else
    {
        shengziAngle += 2;
        shengzi.rotation = shengziAngle;
    }
}