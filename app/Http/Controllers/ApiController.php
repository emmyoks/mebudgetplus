<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;

class ApiController extends Controller
{
    //
    // (int)$num to convert string to integer
    // time()
    // date("F-Y",)
    
    public function addToBudget(Request $request,$userId){
        $budgetTable = Budget::where('userid',$userId)->firstOrFail();
        preg_match( '#^\w{3}#i', date("F"), $match);
        $month = $match[0];
        $time = strval(time());
        $timedMonthBudget = $time.$request->month_budget;
        $budgetTable->$month = $timedMonthBudget;
        if($request->month_budget){
            $budgetTable->save();
            return response(true);
        }else{
            return response(false);
        }
    }
    

}
