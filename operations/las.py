'''module for loan calculations'''
from p1.data.session import session

class Las:
    '''class model'''
    def __init__(self):
        '''initializer'''
        self.max_risk = 0.20
        self.min_risk = 0.075
    def get_risk(self, income, debt, expenses):
        income_to_debt = ( int(debt)/( int(income) - int(expenses)) )
        risk = self.max_risk - (income_to_debt/10)
        if risk < self.min_risk:
            risk = str(0.075)
        elif risk > self.max_risk:
            risk = str(0.20)
        else:
            risk = ("%.2f" % risk)
        return risk
    def evaluate_loan(self,application, user):
        risk = float(user['risk'])
        if application['loan_type'] == 'Mortgage':
            if risk >= self.max_risk:
                application['status'] = 'Approved!'
            elif risk < self.max_risk:
                application['status'] = 'Pending'
                application['reason'] = ''
        elif application['loan_type'] == 'Personal':
            if risk >= self.max_risk:
                application['status'] = 'Pending'
                application['reason'] = ''
            elif risk < self.max_risk:
                application['status'] = 'Collateral needed'
                application['reason'] = ''
        elif application['loan_type'] == 'Student':
            if risk >= self.max_risk:
                application['status'] = 'Approved!'
            elif risk < self.max_risk:
                application['status'] = 'Pending'
                application['reason'] = ''
        return application
