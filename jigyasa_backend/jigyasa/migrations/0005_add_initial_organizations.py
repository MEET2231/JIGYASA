from django.db import migrations

def create_organizations(apps, schema_editor):
    Organization = apps.get_model('jigyasa', 'Organization')
    organizations = [
        {'name': 'Indian Institute of Information Technology Vadodara', 'code': 'IIITV'},
        {'name': 'Indian Institute of Technology Gandhinagar', 'code': 'IITGN'},
        {'name': 'Dhirubhai Ambani Institute of Information and Communication Technology', 'code': 'DAIICT'},
        {'name': 'Government Engineering College', 'code': 'GEC'},
        {'name': 'Nirma University', 'code': 'NU'},
        {'name': 'Gujarat Technological University', 'code': 'GTU'},
        {'name': 'Sardar Patel Institute of Technology', 'code': 'SPIT'},
        {'name': 'L.D. College of Engineering', 'code': 'LDCE'},
    ]
    for org in organizations:
        Organization.objects.create(**org)

class Migration(migrations.Migration):

    dependencies = [
        ('jigyasa', '0004_organization_alter_survey_created_by_userprofile_and_more'),
    ]

    operations = [
        migrations.RunPython(create_organizations),
    ] 