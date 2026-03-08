export default function PublishPanel({ form, setForm }: any) {

function update(value:string){

setForm({...form,status:value})

}

return(

<div className="bg-white border rounded-lg p-6 sticky top-6">

<h3 className="text-sm font-semibold mb-4">
Publish
</h3>

<div className="space-y-3 mb-6">

<label className="flex items-center gap-2 text-sm">

<input
type="radio"
checked={form?.status === "draft"}
onChange={()=>update("draft")}
/>

Draft

</label>

<label className="flex items-center gap-2 text-sm">

<input
type="radio"
checked={form?.status === "published"}
onChange={()=>update("published")}
/>

Published

</label>

</div>

<button
type="submit"
className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700"
>
Create Product
</button>

</div>

)
}
