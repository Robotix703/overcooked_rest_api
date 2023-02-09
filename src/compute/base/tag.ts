import Tag, { ITag } from "../../models/tag";

export namespace baseTag {

    export async function writeTag(name: string, image: string){
        const tag = new Tag({
            name: name,
            image: image
        });

        return tag.save()
        .then((result: ITag) => {
            return result;
        })
        .catch((error: Error) => {
            return { error: error };
        });
    }

    export async function getTags(){
        return Tag.find();
    }

    export async function updateTag(id: string, name: string, image: string){
        const tag = new Tag({
            _id: id,
            name: name,
            image: image
        });

        return Tag.updateOne({ _id: id }, tag);
    }

    export async function deleteTag(tagId: string){
        return Tag.deleteOne({ _id: tagId });
    }
}