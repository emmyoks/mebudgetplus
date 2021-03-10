<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ProfileController extends Controller
{
    //

    function changePassword(Request $request){

        $request->validate([
            'password'=>'required',
            'new_password'=>'required',
            'confirm_password'=>'required'
        ]);
        
        $id = Auth::user()->id;
        $user = User::findOrFail($id);
        if(Hash::check($request->password, $user->password)){
            if($request->input('new_password') === $request->input('confirm_password')){
                $user->password = Hash::make($request->input('new_password'));
                $response = [
                    'success' => 'Password changed successfully.'
                ];
                $user->save();
                return redirect('/')->with($response);
            }else{
                $response = [
                    'error' => 'Incorrect confirmation of New Password.'
                ];
                return back()->with($response);
            }
        }else{
            $response = [
                'error' => 'Incorrect Current Password.'
            ];
            return back()->with($response);
        }
        
    }

    function changeUsername(Request $request){

        $request->validate([
            'new_username'=>'required'
        ]);
        
        $id = Auth::user()->id;
        $user = User::findOrFail($id);
        $user->name = $request->input('new_username');
        $user->save();
        $response = [
            'success' => 'Username changed successfully.'
        ];
        return redirect('/')->with($response);
    }
}
