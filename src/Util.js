/**
 * 存放一些常用的工具函数
 */

//用于调整节点的位置
var moveNode = function(node, off)
{
    node.x = node.x + off.x;
    node.y = node.y + off.y;
}

//查找节点下的子节点
var seekFromRootByName = function(root, name)
{
    if (!root)
    {
        return nullptr;
    }

    if (root.getName() == name)
    {
        return root;
    }

    var arrayNode = root.getChildren();

    for (var i = 0; i < arrayNode.length; i++)
    {
        var pNode = arrayNode[i];

        if (pNode)
        {
            var res = seekFromRootByName(pNode, name);

            if (res)
            {
                return res;
            }
        }
    }

    return null;
}