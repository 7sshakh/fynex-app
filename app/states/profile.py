from aiogram.fsm.state import State, StatesGroup


class ProfileStates(StatesGroup):
    choosing_language = State()
    waiting_for_mission_start = State()
    waiting_for_name = State()
    waiting_for_contact = State()
    waiting_for_social_usage = State()
    waiting_for_social_platforms = State()
    waiting_for_social_time = State()
    waiting_for_goal = State()
    waiting_for_free_time = State()
