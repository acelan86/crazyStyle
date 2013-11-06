echo '打包需要文件'
cp *.* release/crazyStyle
cp -r css release/crazyStyle
cp -r moduleJs release/crazyStyle
cd release/crazyStyle
rm *.sh
mkdir images
cd ../..
pwd
cp images/tick.jpg release/crazyStyle/images/
