import connectDB from "@root/actions/db/connectDB";

export async function GET() {
    try {
        await connectDB();
        return Response.json({
            status: 200,
        });
    }
    catch (err) {
        return Response.json({
            status: 500,
            message: "Internal Server Error " + err.message
        });
    }
}