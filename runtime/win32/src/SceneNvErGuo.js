//通天河场景
var NvErGuoLayer = cc.Layer.extend(
{
    ctor:function ()
    {
        this._super();

        console.log("女儿国");

        return true;
    }
});

var SceneNvErGuo = cc.Scene.extend(
{
    onEnter:function ()
    {
        this._super();
        var layer = new NvErGuoLayer();
        this.addChild(layer);
    }
});

