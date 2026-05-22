source .env
tag=$(sed -En 's/"version": "(.*)",/\1/p' package.json | sed 's/^[[:space:]]*//; s/[[:space:]]*$//;')
image="rickbordelon/resume"
echo "Image: $image"
echo "Tag: $tag"
echo "Registry: $AWS_REGISTRY"

taggedImage=$AWS_REGISTRY/$image:$tag
latestImage=$AWS_REGISTRY/$image:latest
docker build -t $taggedImage .
docker tag $taggedImage $latestImage

git tag -a $tag -m $taggedImage
git push origin $tag

docker push $taggedImage
docker push $latestImage
