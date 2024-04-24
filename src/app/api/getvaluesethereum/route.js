import{NextResponse} from 'next/server'
import {connection} from "@/libs/mysql";

export async function GET() {
    
    const result = await connection.query("SELECT * FROM cryptocurrency_data WHERE Name = 'Ethereum'");

    if(!result){
        return NextResponse.json({
          message:"Match not found"
        },{
          status:404
        })
      }
    console.log(result)
    return NextResponse.json(result);
}