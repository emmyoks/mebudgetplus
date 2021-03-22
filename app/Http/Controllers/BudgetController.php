<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Budget;

class BudgetController extends Controller
{
    //
    
    public function getMonthBudget($month = null){
        
        function availableMonths(){
            $months = ["January", "Febuary", "March", "April", "May", "June", "July", "August"
            , "September", "October", "November", "December"];
            $currMKey = array_search(date("F"), $months);
            $rearrangedMonths = array_merge(array_slice($months, $currMKey),array_slice($months, 0, $currMKey));
            return $rearrangedMonths;    
        }
        $userId = Auth::user()->id;
        $budgetTable = Budget::where('userid',$userId)->firstOrFail();

        function expensesPercent($budgetTable){
            function extractPer($objStr){
                if(!$objStr){
                    return 0;
                }
                $obj = json_decode($objStr);
                return $obj->percentage;
            }
            $obj = [
                ["Jan" =>extractPer(preg_replace('/^\d+/','',$budgetTable->jan))], 
                ["Feb" => extractPer(preg_replace('/^\d+/','',$budgetTable->feb))], 
                ["Mar" => extractPer(preg_replace('/^\d+/','',$budgetTable->mar))], 
                ["Apr" => extractPer(preg_replace('/^\d+/','',$budgetTable->apr))], 
                ["May" => extractPer(preg_replace('/^\d+/','',$budgetTable->may))], 
                ["Jun" => extractPer(preg_replace('/^\d+/','',$budgetTable->jun))], 
                ["Jul" => extractPer(preg_replace('/^\d+/','',$budgetTable->jul))], 
                ["Aug" => extractPer(preg_replace('/^\d+/','',$budgetTable->aug))], 
                ["Sep" => extractPer(preg_replace('/^\d+/','',$budgetTable->sep))], 
                ["Oct" => extractPer(preg_replace('/^\d+/','',$budgetTable->oct))], 
                ["Nov" => extractPer(preg_replace('/^\d+/','',$budgetTable->nov))], 
                ["Dec" => extractPer(preg_replace('/^\d+/','',$budgetTable->dec))]
            ];
            return $obj;
        }

        if(!$month){
            $getMonth = date("F");
            $curr = true;
            preg_match( '#^\w{3}#i', $getMonth, $match);
            $currMonth = strtolower($match[0]);
            $monthBudget = $budgetTable->$currMonth;
            preg_match( '/^\d+/', $monthBudget, $match);
            $year = $monthBudget?date("Y",$match[0]):null;
            if($year != date("Y")){
                $budgetTable->$currMonth = time();
                $budgetTable->save();
                $data =null;
            }
            else{
                $data = preg_replace('/^\d+/','',$monthBudget);
            }
        }else{
            $curr = false;
            preg_match( '#^\w{3}#i', $month, $match);
            $pastMonth = strtolower($match[0]);
            $monthBudget = $budgetTable->$pastMonth;
            preg_match( '/^\d+/', $monthBudget, $match);
            $year = $monthBudget?date("Y",$match[0]):null;
            $data = preg_replace('/^\d+/','',$monthBudget);
            $getMonth = $monthBudget?date("F",$match[0]):null;;
        }
        $availableMonths = availableMonths();
        $expObj = expensesPercent($budgetTable);
        $info = [
            'year' => $year,
            'month' => $getMonth,
            'expObj' => $expObj,
            'budgetForList'=>$availableMonths,
            'curr' => $curr,
            'monthBudget' => $data
        ];
        return view('pages.index', $info);
    }
}
