import Tag, { ITag } from "../../models/tag";

export namespace baseTag {

    export async function writeTag(name: string, color: string, path: string){
        const tag = new Tag({
            name: name,
            color: color,
            path: path
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

    export async function updateTag(id: string, name: string, color: string, path: string){
        const tag = new Tag({
            _id: id,
            name: name, 
            color: color,
            path: path
        });

        return Tag.updateOne({ _id: id }, tag);
    }

    export async function deleteTag(tagId: string){
        return Tag.deleteOne({ _id: tagId });
    }
}