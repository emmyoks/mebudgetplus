<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BudgetController;
use App\Http\Controllers\ProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Route::middleware(['auth'])->group(
    function(){
        Route::get('/', [BudgetController::class, 'getMonthBudget']);

        Route::get('/for/{month}', [BudgetController::class, 'getMonthBudget']);
    });

Route::get('/resetinfo', function(){
    return view('pages.resetinfo');
})->middleware('auth');

Route::post('/change-password', [ProfileController::class, 'changePassword'])->name('change-pw')->middleware('auth');
Route::post('/change-username', [ProfileController::class, 'changeUsername'])->name('change-un')->middleware('auth');

Auth::routes();

Route::get('/home', [App\Http\Controllers\HomeController::class, 'index'])->name('home');
