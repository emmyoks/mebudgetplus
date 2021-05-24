@extends('layouts.app')

@section('style')
    <link href="{{ asset('css/style.css') }}" rel="stylesheet">
@endsection

@section('budget_for')
    <div class="dropdown show">
        <a class="nav-link dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Budget for
        </a>
    
        <div class="dropdown-menu" aria-labelledby="dropdownMenuLink">
            @foreach ($budgetForList as $mon)
            <a class="dropdown-item" href="{{ url('/') }}/for/{{$mon}}">{{$mon}}</a>
            @endforeach
        </div>
    </div>
@endsection

@section('content')
    
    <div class="top">
        
        <div class="budget">
            <div class="greetings">
                Hi <span class="display-username">{{ Auth::user()->name }}</span> :
            </div>
            <div class="budget-title">
                Available Budget in <span class="budget-title-month">{{$month}} {{$year}}</span> :
            </div>

            <div class="budget-value">00.00</div>

            <div class="budget-income clearfix">
                <div class="budget-income-text">Income</div>
                <div class="right">
                    <div class="budget-income-value">+ 00.00</div>
                </div>
            </div>
            <div class="budget-expenses clearfix">
                <div class="budget-expenses-text">Expenses</div>
                <div class="right">
                    <div class="budget-expenses-value">- 00.00</div>
                    <div class="budget-expenses-percentage">0%</div>
                </div>
            </div>
        </div>
    </div>
    <div class="bottom">
        @if ($curr)
            
            <div class="add">
                <div class="add-container">
                    <select class="add-type">
                        <option value="inc" selected>+</option>
                        <option value="exp">-</option>
                    </select>
                    <input type="text" class="add-description" placeholder="Add description">
                    <input type="number" class="add-value" placeholder="Value">
                    <button class="fas fa-plus add-btn"></button>
                </div>
            </div>
        @endif

        <div class="wrapper clearfix">
            <div class="income">
                <h2 class="income-title">Income</h2>

                <div class="income-list">
                </div>
            </div>   
            <div class="expenses">
                <h2 class="expenses-title">Expenses</h2>

                <div class="expenses-list">
            
                </div>
            </div>
        </div>
        <div id="stat">
            <h5>Expenses chart for the year.(In percentages)</h5>
            <canvas id="year_barchart" width="1100" height="500">   
            </canvas>
        </div>
    </div>
@endsection
@section('script')
    <script src="{{ asset('js/rbar.js') }}" defer></script>
    <script src="{{ asset('js/app.js') }}" defer></script>
    <script>
        const userId = {{Auth::user()->id}} ;
        const dbDataStr = @json($monthBudget);
        const dbData = dbDataStr?JSON.parse(dbDataStr):null;
        const expObj = @json($expObj);
        const curr = @json($curr);
        const abs_url = "{{ url('/') }}"
    </script>
@endsection